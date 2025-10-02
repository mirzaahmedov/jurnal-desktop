import type { AvansProvodkaFormValues } from '../config'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
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
import { DocumentFields, OpisanieFields, PodotchetFields, SummaFields } from '@/common/widget/form'

import { usePodotchetSaldo } from '../../saldo_legacy/use-saldo'
import { AvansFormSchema, AvansProvodkaFormSchema, AvansQueryKeys, defaultValues } from '../config'
import { AvansService } from '../service'
import { podvodkaColumns } from './podvodki'

const AvansDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { main_schet_id, jur4_schet_id } = useRequisitesStore()
  const { startDate, endDate } = useSelectedMonthStore()

  const { t } = useTranslation(['app'])
  const { queuedMonths } = usePodotchetSaldo()
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'avans'
  })

  const defaultDate = () =>
    startDate <= new Date() && new Date() <= endDate
      ? formatDate(new Date())
      : formatDate(startDate)

  const form = useForm({
    resolver: zodResolver(AvansFormSchema),
    defaultValues: {
      ...defaultValues,
      doc_date: defaultDate()
    }
  })

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: form.watch('id_spravochnik_podotchet_litso'),
      onChange: (value) => {
        form.setValue('id_spravochnik_podotchet_litso', value ?? 0, { shouldValidate: true })
        form.setValue('spravochnik_podotchet_litso_id', value ?? 0, { shouldValidate: true })
      }
    })
  )

  const {
    data: avans,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      AvansQueryKeys.getById,
      Number(id),
      {
        main_schet_id,
        schet_id: jur4_schet_id
      }
    ],
    queryFn: AvansService.getById,
    enabled: id !== 'create' && !!main_schet_id && !!jur4_schet_id && !queuedMonths.length
  })
  const { mutate: createAvans, isPending: isCreating } = useMutation({
    mutationKey: [AvansQueryKeys.create],
    mutationFn: AvansService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [AvansQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [AvansQueryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, err)
    }
  })

  const { mutate: updateAvans, isPending: isUpdating } = useMutation({
    mutationKey: [AvansQueryKeys.update, id],
    mutationFn: AvansService.update,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [AvansQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [AvansQueryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, err)
    }
  })

  const onSubmit = form.handleSubmit(
    ({
      doc_date,
      doc_num,
      spravochnik_podotchet_litso_id,
      id_spravochnik_podotchet_litso,
      opisanie
    }) => {
      if (id !== 'create') {
        updateAvans({
          id: Number(id),
          doc_date,
          doc_num,
          spravochnik_podotchet_litso_id,
          id_spravochnik_podotchet_litso,
          opisanie,
          childs: podvodki.map(normalizeEmptyFields<AvansProvodkaFormValues>)
        })
        return
      }
      createAvans({
        doc_date,
        doc_num,
        spravochnik_podotchet_litso_id,
        id_spravochnik_podotchet_litso,
        opisanie,
        childs: podvodki.map(normalizeEmptyFields<AvansProvodkaFormValues>)
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
          title: t('pages.podotchet')
        },
        {
          path: '/accountable/avans',
          title: t('pages.avans')
        }
      ],
      enableSaldo: true,
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  }, [error])

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
        doc_date: defaultDate()
      })
      return
    }

    if (avans?.data) {
      form.reset({
        ...avans.data,
        spravochnik_podotchet_litso_id: avans.data.id_spravochnik_podotchet_litso,
        id_spravochnik_podotchet_litso: avans.data.id_spravochnik_podotchet_litso
      })
      return
    }

    form.reset(defaultValues)
  }, [form, avans, id, startDate])

  return (
    <DetailsView>
      <DetailsView.Content isLoading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="grid grid-cols-2">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                  documentType={DocumentType.AVANS}
                  autoGenerate={id === 'create'}
                  validateDate={id === 'create' ? validateDateWithinSelectedMonth : undefined}
                  calendarProps={
                    id === 'create'
                      ? {
                          fromMonth: startDate,
                          toMonth: endDate
                        }
                      : undefined
                  }
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <div className="h-full bg-slate-50">
                  <PodotchetFields
                    tabIndex={3}
                    spravochnik={podotchetSpravochnik}
                    error={
                      form.formState.errors.id_spravochnik_podotchet_litso ||
                      form.formState.errors.spravochnik_podotchet_litso_id
                    }
                  />
                </div>
                <SummaFields data={{ summa: form.watch('summa') }} />
              </div>

              <div className="p-5">
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
            tabIndex={5}
            form={form}
            name="childs"
            columnDefs={podvodkaColumns}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: AvansProvodkaFormSchema,
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

export default AvansDetailsPage
