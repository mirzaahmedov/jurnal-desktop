import type { PokazatUslugiFormValues, PokazatUslugiProvodkaFormValues } from '../config'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { Fieldset } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { Form } from '@/common/components/ui/form'
import { DocumentType } from '@/common/features/doc-num'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
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
import { useLayout } from '@/common/layout'
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

import { useUslugiSaldo } from '../../saldo/use-saldo'
import {
  PokazatUslugiFormSchema,
  PokazatUslugiProvodkaFormSchema,
  defaultValues,
  queryKeys
} from '../config'
import { PokazatUslugiService } from '../service'
import { podvodkaColumns } from './podvodki'

const PokazatUslugiDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const { t } = useTranslation(['app'])
  const { main_schet_id, jur3_schet_152_id } = useRequisitesStore()
  const { queuedMonths } = useUslugiSaldo()
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'pokazat-uslugi'
  })

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const form = useForm({
    resolver: zodResolver(PokazatUslugiFormSchema),
    defaultValues: {
      ...defaultValues,
      doc_date: formatDate(startDate)
    }
  })

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
        pudratchi_bool: false
      }
    })
  )

  const {
    data: pokazatUslugi,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      queryKeys.getById,
      Number(id),
      {
        main_schet_id,
        schet_id: jur3_schet_152_id
      }
    ],
    queryFn: PokazatUslugiService.getById,
    enabled: id !== 'create' && !!main_schet_id && !!jur3_schet_152_id && !queuedMonths.length
  })
  const { mutate: createUslugi, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: PokazatUslugiService.create,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_3_152, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
    }
  })

  const { mutate: updateUslugi, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update, id],
    mutationFn: PokazatUslugiService.update,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_3_152, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
    }
  })

  const onSubmit = form.handleSubmit(
    ({
      doc_date,
      doc_num,
      id_spravochnik_organization,
      shartnoma_grafik_id,
      shartnomalar_organization_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      opisanie,
      summa
    }: PokazatUslugiFormValues) => {
      if (id !== 'create') {
        updateUslugi({
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
          childs: podvodki.map(normalizeEmptyFields<PokazatUslugiProvodkaFormValues>)
        })
        return
      }
      createUslugi({
        doc_date,
        doc_num,
        shartnomalar_organization_id,
        shartnoma_grafik_id,
        id_spravochnik_organization,
        organization_by_raschet_schet_id,
        organization_by_raschet_schet_gazna_id,
        opisanie,
        summa,
        childs: podvodki.map(normalizeEmptyFields<PokazatUslugiProvodkaFormValues>)
      })
    }
  )

  const podvodki = useWatch({
    control: form.control,
    name: 'childs'
  })

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
      enableSaldo: true,
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
      form.reset({
        ...defaultValues,
        doc_date: formatDate(startDate)
      })
      return
    }

    form.reset(pokazatUslugi?.data)
  }, [form, pokazatUslugi, id])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
    }
  }, [error])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2">
              <DocumentFields
                tabIndex={1}
                form={form}
                documentType={DocumentType.SHOW_SERVICE}
                autoGenerate={id === 'create'}
                validateDate={id === 'create' ? validateDateWithinSelectedMonth : undefined}
                calendarProps={
                  id === 'create'
                    ? {
                        fromMonth: startDate,
                        toMonth: startDate
                      }
                    : undefined
                }
              />
            </div>

            <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
              <OrganizationFields
                tabIndex={3}
                spravochnik={organSpravochnik}
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
                snippets={snippets}
                addSnippet={addSnippet}
                removeSnippet={removeSnippet}
              />
            </div>

            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={7}
                isDisabled={isCreating || isUpdating}
                isPending={isCreating || isUpdating}
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
            form={form}
            name="childs"
            columnDefs={podvodkaColumns}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: PokazatUslugiProvodkaFormSchema,
              defaultValues: defaultValues.childs[0]
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
