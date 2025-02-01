import type { RasxodPayloadType, RasxodPodvodkaPayloadType } from '../service'

import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { AccountBalance, Fieldset } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { Form } from '@/common/components/ui/form'
import { APIEndpoints } from '@/common/features/crud'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useToast } from '@/common/hooks/use-toast'
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'
import { getDataFromCache } from '@/common/lib/query-client'
import { numberToWords } from '@/common/lib/utils'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { Operatsii } from '@/common/models'
import { DocumentFields, OpisanieFields, PodotchetFields, SummaFields } from '@/common/widget/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { kassaMonitorQueryKeys, kassaMonitorService } from '@renderer/app/kassa/monitor'
import { EditableTable } from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultValues, queryKeys } from '../constants'
import { RasxodPayloadSchema, RasxodPodvodkaPayloadSchema, kassaRasxodService } from '../service'
import { KassaRasxodOrderTemplate } from '../templates'
import { podvodkaColumns } from './podvodki'

import { DetailsView } from '@/common/views'
import { GenerateFile } from '@renderer/common/features/file'
import { useTranslation } from 'react-i18next'

const KassaRasxodDetailtsPage = () => {
  const { toast } = useToast()
  const { id } = useParams()
  const { t } = useTranslation(['app'])

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const form = useForm({
    resolver: zodResolver(RasxodPayloadSchema),
    defaultValues
  })

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: form.watch('id_podotchet_litso'),
      onChange: (value) => {
        form.setValue('id_podotchet_litso', value)
        form.trigger('id_podotchet_litso')
      }
    })
  )

  const { data: main_schet } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById,
    enabled: !!main_schet_id
  })
  const { data: monitor, isFetching: isFetchingMonitor } = useQuery({
    queryKey: [
      kassaMonitorQueryKeys.getAll,
      {
        main_schet_id,
        limit: 10,
        page: 1,
        from: formatDate(getFirstDayOfMonth()),
        to: formatDate(getLastDayOfMonth())
      }
    ],
    queryFn: kassaMonitorService.getAll
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
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: kassaRasxodService.create,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })
      form.reset(defaultValues)
      form.reset(defaultValues)
      navigate('/kassa/rasxod')
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: kassaRasxodService.update,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })
      navigate('/kassa/rasxod')
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const onSubmit = form.handleSubmit((payload: RasxodPayloadType) => {
    const { doc_date, doc_num, opisanie, id_podotchet_litso, summa } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        id_podotchet_litso,
        summa,
        opisanie,
        childs: podvodki.map(normalizeEmptyFields<RasxodPodvodkaPayloadType>)
      })
      return
    }
    create({
      doc_date,
      doc_num,
      id_podotchet_litso,
      summa,
      opisanie,
      childs: podvodki.map(normalizeEmptyFields<RasxodPodvodkaPayloadType>)
    })
  })

  const podvodki = form.watch('childs')
  const setPodvodki = useCallback(
    (payload: RasxodPodvodkaPayloadType[]) => {
      form.setValue('childs', payload)
    },
    [form]
  )

  const summa = form.watch('summa')
  const reminder = (monitor?.meta?.summa_to ?? 0) - (summa ?? 0) + (rasxod?.data?.summa ?? 0)

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
    if (id === 'create') {
      form.reset(defaultValues)
      setPodvodki(defaultValues.childs)
      return
    }

    form.reset(rasxod?.data ?? defaultValues)
    setPodvodki(rasxod?.data?.childs ?? defaultValues.childs)
  }, [setPodvodki, form, rasxod, id])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isCreating || isUpdating}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="flex">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <PodotchetFields
                  tabIndex={2}
                  spravochnik={podotchetSpravochnik}
                  error={form.formState.errors.id_podotchet_litso}
                />
                <SummaFields data={{ summa: form.watch('summa') }} />
              </div>

              <div className="mt-3 p-5">
                <OpisanieFields
                  tabIndex={3}
                  form={form}
                />
              </div>
            </div>

            <DetailsView.Footer className="flex flex-row items-center gap-10">
              <DetailsView.Create
                disabled={
                  !monitor?.meta?.summa_to ||
                  monitor?.meta?.summa_to < 0 ||
                  !summa ||
                  reminder < 0 ||
                  isFetchingMonitor ||
                  isFetching ||
                  isUpdating ||
                  isCreating
                }
                tabIndex={5}
              />

              {summa ? <AccountBalance balance={reminder} /> : null}

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
                      summaWords={numberToWords(form.watch('summa') ?? 0)}
                      podvodkaList={form
                        .watch('childs')
                        .map(({ summa, spravochnik_operatsii_id }) => {
                          const result = getDataFromCache<Operatsii>(queryClient, [
                            APIEndpoints.operatsii,
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
            columns={podvodkaColumns}
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
