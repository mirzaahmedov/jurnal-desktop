import type { PokazatUslugiForm, PokazatUslugiProvodkaForm } from '../service'

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

import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { Fieldset } from '@/common/components'
import { Form } from '@/common/components/ui/form'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useToast } from '@/common/hooks/use-toast'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { TypeSchetOperatsii } from '@/common/models'
import { DetailsView } from '@/common/views'
import {
  DocumentFields,
  OperatsiiFields,
  OpisanieFields,
  OrganizationFields,
  ShartnomaFields,
  SummaFields
} from '@/common/widget/form'

import { defaultValues, queryKeys } from '../constants'
import {
  PokazatUslugiFormSchema,
  PokazatUslugiProvodkaFormSchema,
  pokazatUslugiService
} from '../service'
import { podvodkaColumns } from './podvodki'

const PokazatUslugiDetailsPage = () => {
  const { toast } = useToast()
  const { t } = useTranslation(['app'])

  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const form = useForm({
    resolver: zodResolver(PokazatUslugiFormSchema),
    defaultValues: defaultValues
  })

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('id_spravochnik_organization'),
      onChange: (value, organization) => {
        form.setValue('shartnomalar_organization_id', 0)
        form.setValue('id_spravochnik_organization', value ?? 0)
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

  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      value: form.watch('spravochnik_operatsii_own_id'),
      onChange: (value) => {
        form.setValue('spravochnik_operatsii_own_id', value ?? 0)
        form.trigger('spravochnik_operatsii_own_id')
      },
      params: {
        type_schet: TypeSchetOperatsii.GENERAL
      }
    })
  )

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: form.watch('shartnomalar_organization_id'),
      onChange: (value) => {
        form.setValue('shartnomalar_organization_id', value)
        form.trigger('shartnomalar_organization_id')
      },
      params: {
        organ_id: form.watch('id_spravochnik_organization'),
        pudratchi_bool: false
      }
    })
  )

  const { data: pokazatUslugi, isFetching } = useQuery({
    queryKey: [queryKeys.getById, Number(id), { main_schet_id }],
    queryFn: pokazatUslugiService.getById,
    enabled: id !== 'create'
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: pokazatUslugiService.create,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate('/organization/pokazat-uslugi')
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update, id],
    mutationFn: pokazatUslugiService.update,
    onSuccess() {
      toast({ title: 'Документ успешно обновлен' })

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate('/organization/pokazat-uslugi')
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const onSubmit = form.handleSubmit((payload: PokazatUslugiForm) => {
    const {
      doc_date,
      doc_num,
      id_spravochnik_organization,
      spravochnik_operatsii_own_id,
      shartnoma_grafik_id,
      shartnomalar_organization_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      opisanie,
      summa
    } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        spravochnik_operatsii_own_id,
        shartnomalar_organization_id,
        shartnoma_grafik_id,
        id_spravochnik_organization,
        organization_by_raschet_schet_id,
        organization_by_raschet_schet_gazna_id,
        opisanie,
        summa,
        childs: podvodki.map(normalizeEmptyFields<PokazatUslugiProvodkaForm>)
      })
      return
    }
    create({
      doc_date,
      doc_num,
      spravochnik_operatsii_own_id,
      shartnomalar_organization_id,
      shartnoma_grafik_id,
      id_spravochnik_organization,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      opisanie,
      summa,
      childs: podvodki.map(normalizeEmptyFields<PokazatUslugiProvodkaForm>)
    })
  })

  const podvodki = form.watch('childs')
  const setPodvodki = useCallback(
    (payload: PokazatUslugiProvodkaForm[]) => {
      form.setValue('childs', payload)
    },
    [form]
  )

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        },
        {
          path: '/organization/pokazat-uslugi',
          title: t('pages.service')
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
        .filter((podvodka) => !isNaN(podvodka.kol!) && !isNaN(podvodka.sena!))
        .reduce((acc, curr) => acc + curr.kol! * curr.sena!, 0) ?? 0
    form.setValue('summa', summa)
  }, [form, podvodki])

  useEffect(() => {
    if (id === 'create') {
      form.reset(defaultValues)
      setPodvodki(defaultValues.childs)
      return
    }

    form.reset(pokazatUslugi?.data ?? defaultValues)
    setPodvodki(pokazatUslugi?.data?.childs ?? defaultValues.childs)
  }, [setPodvodki, form, pokazatUslugi, id])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isCreating || isUpdating}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2">
              <DocumentFields
                tabIndex={1}
                form={form}
                documentType={DocumentType.SHOW_SERVICE}
                autoGenerate={id === 'create'}
              />
              <OperatsiiFields
                tabIndex={2}
                spravochnik={operatsiiSpravochnik}
                error={form.formState.errors.spravochnik_operatsii_own_id}
              />
            </div>

            <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
              <OrganizationFields
                tabIndex={3}
                spravochnik={orgSpravochnik}
                form={form as any}
                error={form.formState.errors.id_spravochnik_organization}
                name={t('buyer')}
                className="bg-slate-50"
              />
              <div className="h-full flex flex-col divide-y divide-border">
                <ShartnomaFields
                  tabIndex={4}
                  disabled={!form.watch('id_spravochnik_organization')}
                  form={form as any}
                  spravochnik={shartnomaSpravochnik}
                  error={form.formState.errors.shartnomalar_organization_id}
                />
                <SummaFields data={{ summa: form.watch('summa') }} />
              </div>
            </div>

            <div className="mt-5 p-5">
              <OpisanieFields
                tabIndex={5}
                form={form}
              />
            </div>

            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={7}
                disabled={isCreating || isUpdating}
              />
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name={t('provodka')}
          className="flex-1 mt-10 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={6}
            columns={podvodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: PokazatUslugiProvodkaFormSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onChange={createEditorChangeHandler({
              form
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
          />
        </Fieldset>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default PokazatUslugiDetailsPage
