import type { PrixodPodvodkaPayloadType } from '../service'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { Fieldset } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { Form } from '@/common/components/ui/form'
import { DocumentType } from '@/common/features/doc-num'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSnippets } from '@/common/features/snippents/use-snippets'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useLayoutStore } from '@/common/layout/store'
import { formatDate } from '@/common/lib/date'
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
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { t } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'bank_prixod'
  })

  const form = useForm({
    resolver: zodResolver(PrixodPayloadSchema),
    defaultValues: {
      ...defaultValues,
      doc_date: formatDate(startDate)
    }
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
  const { mutate: createPrixod, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: bankPrixodService.create,
    onSuccess(res) {
      toast.success(res?.message)

      navigate(-1)

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, err)
    }
  })

  const { mutate: updatePrixod, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update, id],
    mutationFn: bankPrixodService.update,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, err)
    }
  })

  const onSubmit = form.handleSubmit(
    ({
      doc_date,
      doc_num,
      id_spravochnik_organization,
      opisanie,
      id_shartnomalar_organization,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      summa
    }) => {
      if (id !== 'create') {
        updatePrixod({
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
      createPrixod({
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
    }
  )

  const podvodki = form.watch('childs')

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
      form.reset({
        ...defaultValues,
        doc_date: formatDate(startDate)
      })
      return
    }

    form.reset(prixod?.data)
  }, [form, prixod, id])

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
                  validateDate={id === 'create' ? validateDateWithinSelectedMonth : undefined}
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
                  snippets={snippets}
                  addSnippet={addSnippet}
                  removeSnippet={removeSnippet}
                />
              </div>
            </div>
            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={6}
                disabled={isFetching || isUpdating || isCreating}
              />
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name={t('provodka')}
          className="flex-1 mt-5 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={5}
            columnDefs={podvodkaColumns}
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
