import type { RasxodPayloadType, RasxodPodvodkaPayloadType } from '../service'
import type { Operatsii } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { kassaMonitorQueryKeys, kassaMonitorService } from '@/app/jur_1/monitor'
import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { AccountBalance, Fieldset } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { Form } from '@/common/components/ui/form'
import { Switch } from '@/common/components/ui/switch'
import { ApiEndpoints } from '@/common/features/crud'
import { DocumentType } from '@/common/features/doc-num'
import { GenerateFile } from '@/common/features/file'
import { createMainZarplataSpravochnik } from '@/common/features/main-zarplata/service'
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
import { formatNumber } from '@/common/lib/format'
import { getDataFromCache } from '@/common/lib/query-client'
import { numberToWords } from '@/common/lib/utils'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { DetailsView } from '@/common/views'
import { DocumentFields, OpisanieFields, PodotchetFields, SummaFields } from '@/common/widget/form'
import { MainZarplataFields } from '@/common/widget/form/main-zarplata'

import { defaultValues, queryKeys } from '../constants'
import { RasxodPayloadSchema, RasxodPodvodkaPayloadSchema, kassaRasxodService } from '../service'
import { KassaRasxodOrderTemplate } from '../templates'
import { podvodkaColumns } from './podvodki'

const KassaRasxodDetailtsPage = () => {
  const { id } = useParams()
  const { t, i18n } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'kassa_rasxod'
  })

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const form = useForm({
    resolver: zodResolver(RasxodPayloadSchema),
    defaultValues: {
      ...defaultValues,
      doc_date: formatDate(startDate)
    }
  })

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: form.watch('id_podotchet_litso'),
      onChange: (value) => {
        form.setValue('id_podotchet_litso', value, { shouldValidate: true })
        form.setValue('main_zarplata_id', 0)
      }
    })
  )

  const mainZarplataSpravochnik = useSpravochnik(
    createMainZarplataSpravochnik({
      value: form.watch('main_zarplata_id'),
      onChange: (id) => {
        form.setValue('main_zarplata_id', id, { shouldValidate: true })
        form.setValue('id_podotchet_litso', 0)
      }
    })
  )

  const { data: main_schet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById,
    enabled: !!main_schet_id
  })
  const {
    data: monitor,
    isFetching: isFetchingMonitor,
    error
  } = useQuery({
    queryKey: [
      kassaMonitorQueryKeys.getAll,
      {
        main_schet_id,
        limit: 10,
        page: 1,
        year,
        month,
        from: form.watch('doc_date'),
        to: form.watch('doc_date')
      }
    ],
    queryFn: kassaMonitorService.getAll,
    enabled: !!form.watch('doc_date')
  })
  const { data: rasxod, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      Number(id),
      {
        main_schet_id: main_schet_id
      }
    ],
    queryFn: kassaRasxodService.getById,
    enabled: id !== 'create'
  })
  const { mutate: createRasxod, isPending: isCreating } = useMutation({
    mutationFn: kassaRasxodService.create,
    onSuccess(res) {
      toast.success(res?.message)

      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })
  const { mutate: updateRasxod, isPending: isUpdating } = useMutation({
    mutationFn: kassaRasxodService.update,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })

  const onSubmit = form.handleSubmit(
    ({
      doc_date,
      doc_num,
      opisanie,
      id_podotchet_litso,
      main_zarplata_id,
      summa
    }: RasxodPayloadType) => {
      if (id !== 'create') {
        updateRasxod({
          id: Number(id),
          doc_date,
          doc_num,
          id_podotchet_litso,
          main_zarplata_id,
          summa,
          opisanie,
          childs: podvodki.map(normalizeEmptyFields<RasxodPodvodkaPayloadType>)
        })
        return
      }
      createRasxod({
        doc_date,
        doc_num,
        id_podotchet_litso,
        main_zarplata_id,
        summa,
        opisanie,
        childs: podvodki.map(normalizeEmptyFields<RasxodPodvodkaPayloadType>)
      })
    }
  )

  const podvodki = form.watch('childs')

  const summa = form.watch('summa')
  const reminder = monitor?.meta
    ? (monitor?.meta?.summa_to ?? 0) - (summa ?? 0) + (rasxod?.data?.summa ?? 0)
    : 0

  useEffect(() => {
    handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
  }, [error])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        },
        {
          path: '/kassa/rasxod',
          title: t('pages.rasxod-docs')
        }
      ],
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, t])

  useEffect(() => {
    const summa =
      podvodki
        .filter((podvodka) => !isNaN(podvodka.summa))
        .reduce((acc, curr) => acc + curr.summa, 0) ?? 0
    form.setValue('summa', summa)
  }, [form, podvodki])

  useEffect(() => {
    if (id === 'create' || !rasxod?.data) {
      form.reset({
        ...defaultValues,
        doc_date: formatDate(startDate)
      })
      return
    }

    form.reset({
      ...rasxod.data,
      main_zarplata_id: Number(rasxod.data.main_zarplata_id),
      is_zarplata: !!rasxod?.data?.main_zarplata_id
    })
  }, [form, rasxod, id])

  console.log({ errors: form.formState.errors })

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
                  documentType={DocumentType.KASSA_RASXOD}
                  autoGenerate={id === 'create'}
                  validateDate={id === 'create' ? validateDateWithinSelectedMonth : undefined}
                  calendarProps={{
                    fromMonth: startDate,
                    toMonth: startDate
                  }}
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <div className="col-span-2 p-5 border-b border-slate-100 flex items-center gap-4">
                  <label className="text-sm font-medium">{t('other')}</label>
                  <Switch
                    checked={form.watch('is_zarplata')}
                    onCheckedChange={(checked) => form.setValue('is_zarplata', !!checked)}
                  />
                  <label className="text-sm font-medium">{t('zarplata')}</label>
                </div>
                {form.watch('is_zarplata') ? (
                  <MainZarplataFields
                    tabIndex={2}
                    spravochnik={mainZarplataSpravochnik}
                    error={form.formState.errors.main_zarplata_id}
                  />
                ) : (
                  <PodotchetFields
                    tabIndex={2}
                    spravochnik={podotchetSpravochnik}
                    error={form.formState.errors.id_podotchet_litso}
                  />
                )}
                <SummaFields data={{ summa: form.watch('summa') }} />
              </div>

              <div className="mt-3 p-5">
                <OpisanieFields
                  tabIndex={3}
                  form={form}
                  snippets={snippets}
                  addSnippet={addSnippet}
                  removeSnippet={removeSnippet}
                />
              </div>
            </div>

            <DetailsView.Footer className="flex flex-row items-center gap-10">
              <DetailsView.Create
                disabled={
                  reminder < 0 || isFetchingMonitor || isFetching || isUpdating || isCreating
                }
                loading={isCreating || isUpdating}
                tabIndex={5}
              />

              {!form.watch('doc_date') || isFetchingMonitor ? null : (
                <AccountBalance balance={reminder} />
              )}

              {main_schet?.data && form.formState.isValid ? (
                <ButtonGroup borderStyle="dashed">
                  <GenerateFile
                    tabIndex={8}
                    fileName={`расходный-кассовый-ордер-${form.watch('doc_num')}.pdf`}
                    buttonText="Скачать расходный кассовый ордер"
                  >
                    <KassaRasxodOrderTemplate
                      doc_date={form.watch('doc_date')}
                      doc_num={form.watch('doc_num')}
                      fio={podotchetSpravochnik.selected?.name ?? ''}
                      summa={formatNumber(form.watch('summa') ?? 0)}
                      summaWords={numberToWords(form.watch('summa') ?? 0, i18n.language)}
                      podvodkaList={form
                        .watch('childs')
                        .map(({ summa, spravochnik_operatsii_id }) => {
                          const result = getDataFromCache<Operatsii>(queryClient, [
                            ApiEndpoints.operatsii,
                            spravochnik_operatsii_id
                          ])
                          const operation = result?.data?.name ?? ''
                          const schet = result?.data?.schet ?? ''
                          return {
                            operation,
                            summa: formatNumber(summa),
                            debet_schet: schet,
                            credit_schet: main_schet?.data?.jur1_schet ?? ''
                          }
                        })}
                    />
                  </GenerateFile>
                </ButtonGroup>
              ) : null}
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name={t('provodka')}
          className="flex-1 mt-10 bg-slate-50"
        >
          <EditableTable
            tabIndex={4}
            columnDefs={podvodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: RasxodPodvodkaPayloadSchema,
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

export default KassaRasxodDetailtsPage
