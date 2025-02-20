import type { PrixodPodvodkaPayloadType } from '../service'

import { useCallback, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { EditableTable } from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { DocumentType } from '@renderer/common/features/doc-num'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { Fieldset } from '@/common/components'
import { Form } from '@/common/components/ui/form'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { DetailsView } from '@/common/views'
import {
  DocumentFields,
  MainSchetFields,
  OpisanieFields,
  OrganizationFields,
  ShartnomaFields,
  SummaFields
} from '@/common/widget/form'

import { defaultValues, queryKeys } from '../constants'
import { PrixodPayloadSchema, PrixodPodvodkaPayloadSchema, bankPrixodService } from '../service'
import { podvodkaColumns } from './podvodki'

const BankPrixodDetailsPage = () => {
  const queryClient = useQueryClient()
  const id = useParams().id as string
  const navigate = useNavigate()

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])

  const form = useForm({
    resolver: zodResolver(PrixodPayloadSchema),
    defaultValues: defaultValues
  })

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('id_spravochnik_organization'),
      onChange: (value, organization) => {
        form.setValue('id_spravochnik_organization', value ?? 0)
        form.setValue('id_shartnomalar_organization', 0)
        form.trigger('id_spravochnik_organization')

        if (organization?.account_numbers?.length === 1) {
          form.setValue('organization_by_raschet_schet_id', organization.account_numbers[0].id)
        } else {
          form.setValue('organization_by_raschet_schet_id', 0)
        }

        form.setValue('organization_by_raschet_schet_gazna_id', 0)
      }
    })
  )

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: form.watch('id_shartnomalar_organization'),
      onChange: (value) => {
        form.setValue('id_shartnomalar_organization', value)
        form.trigger('id_shartnomalar_organization')
      },
      params: {
        organ_id: form.watch('id_spravochnik_organization')
      }
    })
  )

  const { data: main_schet } = useQuery({
    queryKey: [mainSchetQueryKeys.getAll, main_schet_id],
    queryFn: mainSchetService.getById
  })
  const { data: prixod, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: bankPrixodService.getById,
    enabled: id !== 'create'
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: bankPrixodService.create,
    onSuccess() {
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate(-1)
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update, id],
    mutationFn: bankPrixodService.update,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate(-1)
    },
    onError(error) {
      console.error(error)
      toast.error(error.message)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    const {
      doc_date,
      doc_num,
      id_spravochnik_organization,
      opisanie,
      id_shartnomalar_organization,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      summa
    } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        id_spravochnik_organization,
        id_shartnomalar_organization,
        shartnoma_grafik_id,

        organization_by_raschet_schet_id,
        organization_by_raschet_schet_gazna_id,
        summa,
        opisanie,
        childs: podvodki.map(normalizeEmptyFields<PrixodPodvodkaPayloadType>)
      })
      return
    }
    create({
      doc_date,
      doc_num,
      id_spravochnik_organization,
      id_shartnomalar_organization,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      summa,
      opisanie,
      childs: podvodki.map(normalizeEmptyFields<PrixodPodvodkaPayloadType>)
    })
  })

  const podvodki = form.watch('childs')
  const setPodvodki = useCallback(
    (payload: PrixodPodvodkaPayloadType[]) => {
      form.setValue('childs', payload)
    },
    [form]
  )

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.bank')
        },
        {
          path: '/bank/prixod',
          title: t('pages.prixod-docs')
        }
      ],
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  useEffect(() => {
    const summa =
      podvodki
        .filter((podvodka) => !isNaN(podvodka.summa))
        .reduce((acc, curr) => acc + curr.summa, 0) ?? 0
    form.setValue('summa', summa)
  }, [form, podvodki])

  useEffect(() => {
    if (id === 'create') {
      form.reset(defaultValues)
      setPodvodki(defaultValues.childs)
      return
    }

    form.reset(prixod?.data ?? defaultValues)
    setPodvodki(prixod?.data?.childs ?? defaultValues.childs)
  }, [setPodvodki, form, prixod, id])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="flex">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                  documentType={DocumentType.BANK_PRIXOD}
                  autoGenerate={id === 'create'}
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <MainSchetFields
                  main_schet={main_schet?.data}
                  name={t('receiver-info')}
                />
                <OrganizationFields
                  tabIndex={2}
                  error={form.formState.errors.id_spravochnik_organization}
                  spravochnik={orgSpravochnik}
                  form={form as any}
                  name={t('payer-info')}
                  className="bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <SummaFields data={{ summa: form.watch('summa') }} />
                <ShartnomaFields
                  tabIndex={3}
                  disabled={!form.watch('id_spravochnik_organization')}
                  spravochnik={shartnomaSpravochnik}
                  form={form as any}
                  error={form.formState.errors.id_shartnomalar_organization}
                />
              </div>

              <div className="-mt-5 p-5">
                <OpisanieFields
                  tabIndex={4}
                  form={form}
                />
              </div>
            </div>
            <DetailsView.Footer>
              <DetailsView.Create disabled={isFetching || isUpdating || isCreating} />
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name={t('provodka')}
          className="flex-1 mt-5 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={5}
            columns={podvodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: PrixodPodvodkaPayloadSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
            onChange={createEditorChangeHandler({
              form
            })}
          />
        </Fieldset>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default BankPrixodDetailsPage
