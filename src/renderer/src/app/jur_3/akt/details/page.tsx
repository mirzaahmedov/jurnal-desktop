import type { AktProvodkaFormValues } from '../config'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
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
  handleSaldoResponseDates,
  useSaldoController
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
  OpisanieFields,
  OrganizationFields,
  ShartnomaFields,
  SummaFields
} from '@/common/widget/form'

import { AktQueryKeys, defaultValues } from '../config'
import { AktFormSchema, AktProvodkaFormSchema } from '../config'
import { aktService } from '../service'
import { provodkaColumns } from './provodki'

const AktDetailsPage = () => {
  const { t } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'akt'
  })
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_3
  })

  const { main_schet_id, jur3_schet_id } = useRequisitesStore()

  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const form = useForm({
    resolver: zodResolver(AktFormSchema),
    defaultValues: {
      ...defaultValues,
      doc_date: formatDate(startDate)
    }
  })

  const {
    data: akt,
    isFetching: isFetchingAkt,
    error
  } = useQuery({
    queryKey: [
      AktQueryKeys.getById,
      Number(id),
      {
        main_schet_id,
        schet_id: jur3_schet_id
      }
    ],
    queryFn: aktService.getById,
    enabled: id !== 'create' && !!main_schet_id && !queuedMonths.length
  })
  const { mutate: createAkt, isPending: isCreating } = useMutation({
    mutationKey: [AktQueryKeys.create],
    mutationFn: aktService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [AktQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [AktQueryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_3, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3, error)
    }
  })

  const { mutate: updateAkt, isPending: isUpdating } = useMutation({
    mutationKey: [AktQueryKeys.update, id],
    mutationFn: aktService.update,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [AktQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [AktQueryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_3, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3, error)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    const {
      doc_date,
      doc_num,
      id_spravochnik_organization,
      shartnoma_grafik_id,
      shartnomalar_organization_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      opisanie,
      summa
    } = values

    if (id !== 'create') {
      updateAkt({
        id: Number(id),
        doc_date,
        doc_num,
        shartnomalar_organization_id,
        shartnoma_grafik_id,
        id_spravochnik_organization,
        organization_by_raschet_schet_id,
        organization_by_raschet_schet_gazna_id,
        opisanie,
        summa,
        childs: podvodki.map(normalizeEmptyFields<AktProvodkaFormValues>)
      })
      return
    }
    createAkt({
      doc_date,
      doc_num,
      shartnomalar_organization_id,
      id_spravochnik_organization,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      opisanie,
      summa,
      childs: podvodki.map(normalizeEmptyFields<AktProvodkaFormValues>)
    })
  })

  const podvodki = form.watch('childs')

  const organSpravochnik = useSpravochnik(
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

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: form.watch('shartnomalar_organization_id'),
      onChange: (value) => {
        form.setValue('shartnomalar_organization_id', value)
        form.trigger('shartnomalar_organization_id')
      },
      params: {
        organ_id: form.watch('id_spravochnik_organization'),
        pudratchi_bool: true
      }
    })
  )

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        },
        {
          path: '/organization/akt',
          title: t('pages.akt')
        }
      ],
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])
  useEffect(() => {
    handleSaldoErrorDates(SaldoNamespace.JUR_3, error)
  }, [error])

  useEffect(() => {
    const summa =
      podvodki
        .filter((podvodka) => !isNaN(Number(podvodka?.kol)) && !isNaN(Number(podvodka?.sena)))
        .reduce((acc, curr) => acc + (curr?.kol || 0) * (curr?.sena || 0), 0) ?? 0
    form.setValue('summa', summa)
  }, [form, podvodki])

  useEffect(() => {
    if (id === 'create') {
      form.reset({
        ...defaultValues,
        doc_date: formatDate(startDate)
      })
    }

    form.reset(akt?.data)
  }, [form, akt, id])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetchingAkt}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="grid grid-cols-2">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                  documentType={DocumentType.AKT}
                  autoGenerate={id === 'create'}
                  validateDate={validateDateWithinSelectedMonth}
                  calendarProps={{
                    fromMonth: startDate,
                    toMonth: startDate
                  }}
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <OrganizationFields
                  tabIndex={3}
                  spravochnik={organSpravochnik}
                  form={form as any}
                  error={form.formState.errors.id_spravochnik_organization}
                  name={t('supplier')}
                  className="bg-slate-50"
                />
                <div className="h-full flex flex-col divide-y divide-border">
                  <ShartnomaFields
                    tabIndex={4}
                    disabled={!form.watch('id_spravochnik_organization')}
                    spravochnik={shartnomaSpravochnik}
                    form={form as any}
                    error={form.formState.errors.shartnomalar_organization_id}
                  />
                  <SummaFields data={{ summa: form.watch('summa') }} />
                </div>
              </div>

              <div className="p-5 mt-5">
                <OpisanieFields
                  tabIndex={5}
                  form={form}
                  snippets={snippets}
                  addSnippet={addSnippet}
                  removeSnippet={removeSnippet}
                />
              </div>
            </div>

            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={7}
                loading={isCreating || isUpdating}
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
            columnDefs={provodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: AktProvodkaFormSchema,
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

export default AktDetailsPage
