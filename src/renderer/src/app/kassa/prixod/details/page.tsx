import type { PrixodPodvodkaPayloadType } from '../service'

import { PrixodPayloadSchema, PrixodPodvodkaPayloadSchema, kassaPrixodService } from '../service'
import { useCallback, useEffect } from 'react'
import { useSpravochnik } from '@/common/features/spravochnik'
import { Form } from '@/common/components/ui/form'
import { GenerateDocumentButton, Fieldset } from '@/common/components'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { useToast } from '@/common/hooks/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { defaultValues, queryKeys } from '../constants'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { EditableTable } from '@/common/features/editable-table'
import { podvodkaColumns } from './podvodki'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/features/editable-table/helpers'
import { PodotchetFields, DocumentFields, OpisanieFields, SummaFields } from '@/common/widget/form'
import { KassaPrixodOrderTemplate } from '../templates'
import { formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'
import { getDataFromCache } from '@/common/lib/query-client'
import { Operatsii } from '@/common/models'
import { ApiEndpoints } from '@/common/features/crud'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'

import { DetailsView } from '@/common/views'

const KassaPrixodDetailsPage = () => {
  const { toast } = useToast()
  const { id } = useParams()

  const main_schet_id = useMainSchet((store) => store.main_schet?.id)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(PrixodPayloadSchema),
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
  const { data: prixod, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: kassaPrixodService.getById,
    enabled: id !== 'create'
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: kassaPrixodService.create,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })
      form.reset(defaultValues)
      navigate('/kassa/prixod')
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
    mutationFn: kassaPrixodService.update,
    onSuccess() {
      toast({ title: 'Документ успешно обновлен' })
      navigate('/kassa/prixod')
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

  const onSubmit = form.handleSubmit((payload) => {
    const { doc_date, doc_num, opisanie, id_podotchet_litso, summa } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        id_podotchet_litso,
        summa,
        opisanie,
        childs: podvodki.map(normalizeEmptyFields<PrixodPodvodkaPayloadType>)
      })
      return
    }
    create({
      doc_date,
      doc_num,
      id_podotchet_litso,
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

  useLayout({
    title: id === 'create' ? 'Создать приходной документ' : 'Редактировать приходной документ',
    onBack() {
      navigate(-1)
    }
  })

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

              <div className="mt-5 px-5">
                <OpisanieFields
                  tabIndex={3}
                  form={form}
                />
              </div>
            </div>

            <DetailsView.Footer className="flex flex-row items-center gap-10">
              <DetailsView.Create tabIndex={5} />

              {main_schet?.data && form.formState.isValid ? (
                <ButtonGroup borderStyle="dashed">
                  <GenerateDocumentButton
                    tabIndex={8}
                    fileName={`приходной-кассовый-ордер-${form.watch('doc_num')}.pdf`}
                    buttonText="Создать приходной кассовый ордер"
                  >
                    <KassaPrixodOrderTemplate
                      doc_date={form.watch('doc_date')}
                      doc_num={form.watch('doc_num')}
                      fio={podotchetSpravochnik.selected?.name ?? ''}
                      summa={formatNumber(form.watch('summa') ?? 0)}
                      summaWords={numberToWords(form.watch('summa') ?? 0)}
                      workplace=""
                      opisanie={form.watch('opisanie') ?? ''}
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
                            debet_schet: main_schet?.data?.jur1_schet ?? '',
                            credit_schet: schet
                          }
                        })}
                    />
                  </GenerateDocumentButton>
                </ButtonGroup>
              ) : null}
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name="Подводка"
          className="flex-1 mt-5 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={4}
            columns={podvodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: PrixodPodvodkaPayloadSchema,
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

export default KassaPrixodDetailsPage
