import type { PrixodPodvodkaPayloadType } from '../service'
import type { Operatsii } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { EditableTable } from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { Switch } from '@renderer/common/components/ui/switch'
import { DocumentType } from '@renderer/common/features/doc-num'
import { GenerateFile } from '@renderer/common/features/file'
import { createMainZarplataSpravochnik } from '@renderer/common/features/main-zarplata/service'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSnippets } from '@renderer/common/features/snippents/use-snippets'
import { MainZarplataFields } from '@renderer/common/widget/form/main-zarplata'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { Fieldset } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { Form } from '@/common/components/ui/form'
import { ApiEndpoints } from '@/common/features/crud'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'
import { getDataFromCache } from '@/common/lib/query-client'
import { numberToWords } from '@/common/lib/utils'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { DetailsView } from '@/common/views'
import { DocumentFields, OpisanieFields, PodotchetFields, SummaFields } from '@/common/widget/form'

import { defaultValues, queryKeys } from '../constants'
import { PrixodPayloadSchema, PrixodPodvodkaPayloadSchema, kassaPrixodService } from '../service'
import { KassaPrixodOrderTemplate } from '../templates'
import { podvodkaColumns } from './podvodki'

const KassaPrixodDetailsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { id } = useParams()
  const { t, i18n } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'kassa_prixod'
  })

  const form = useForm({
    resolver: zodResolver(PrixodPayloadSchema),
    defaultValues
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

  const { mutate: createPrixod, isPending: isCreating } = useMutation({
    mutationFn: kassaPrixodService.create,
    onSuccess(res) {
      toast.success(res.message)

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate(-1)
    }
  })

  const { mutate: updatePrixod, isPending: isUpdating } = useMutation({
    mutationFn: kassaPrixodService.update,
    onSuccess(res) {
      toast.success(res.message)

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate(-1)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    const { doc_date, doc_num, opisanie, id_podotchet_litso, main_zarplata_id, summa } = payload

    if (id !== 'create') {
      updatePrixod({
        id: Number(id),
        doc_date,
        doc_num,
        id_podotchet_litso,
        main_zarplata_id,
        summa,
        opisanie,
        childs: podvodki.map(normalizeEmptyFields<PrixodPodvodkaPayloadType>)
      })
      return
    }
    createPrixod({
      doc_date,
      doc_num,
      id_podotchet_litso,
      main_zarplata_id,
      summa,
      opisanie,
      childs: podvodki.map(normalizeEmptyFields<PrixodPodvodkaPayloadType>)
    })
  })

  const podvodki = form.watch('childs')

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        },
        {
          path: '/kassa/prixod',
          title: t('pages.prixod-docs')
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
    if (id === 'create' || !prixod?.data) {
      form.reset(defaultValues)
      return
    }

    form.reset({
      ...prixod.data,
      is_zarplata: !!prixod.data.main_zarplata_id
    })
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
                  documentType={DocumentType.KASSA_PRIXOD}
                  autoGenerate={id === 'create'}
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

              <div className="mt-5 px-5">
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
                loading={isCreating || isUpdating}
                tabIndex={5}
              />

              {main_schet?.data && form.formState.isValid ? (
                <ButtonGroup borderStyle="dashed">
                  <GenerateFile
                    tabIndex={6}
                    fileName={`приходной-кассовый-ордер-${form.watch('doc_num')}.pdf`}
                    buttonText="Создать приходной кассовый ордер"
                  >
                    <KassaPrixodOrderTemplate
                      doc_date={form.watch('doc_date')}
                      doc_num={form.watch('doc_num')}
                      fio={podotchetSpravochnik.selected?.name ?? ''}
                      summa={formatNumber(form.watch('summa') ?? 0)}
                      summaWords={numberToWords(form.watch('summa') ?? 0, i18n.language)}
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
                  </GenerateFile>
                </ButtonGroup>
              ) : null}
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name={t('provodka')}
          className="flex-1 mt-5 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={4}
            columnDefs={podvodkaColumns}
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
