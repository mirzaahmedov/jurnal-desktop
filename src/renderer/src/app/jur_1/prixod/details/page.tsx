import type { PrixodProvodkaFormValues } from '../config'
import type { Operatsii } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { Fieldset } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { Form, FormField } from '@/common/components/ui/form'
import { Label } from '@/common/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group'
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
import {
  DocumentFields,
  OpisanieFields,
  OrganizationFields,
  PodotchetFields,
  ShartnomaFields,
  SummaFields
} from '@/common/widget/form'
import { MainZarplataFields } from '@/common/widget/form/main-zarplata'

import {
  PrixodFormSchema,
  PrixodPodvodkaFormSchema,
  PrixodQueryKeys,
  PrixodType,
  defaultValues
} from '../config'
import { KassaPrixodService } from '../service'
import { KassaPrixodOrderTemplate } from '../templates'
import { podvodkaColumns } from './podvodki'

const KassaPrixodDetailsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { id } = useParams()
  const { t, i18n } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'kassa_prixod'
  })

  const form = useForm({
    resolver: zodResolver(PrixodFormSchema),
    defaultValues: {
      ...defaultValues,
      doc_date: formatDate(startDate)
    }
  })

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('id_spravochnik_organization'),
      onChange: (value) => {
        form.setValue('id_spravochnik_organization', value, { shouldValidate: true })
        form.setValue('main_zarplata_id', 0)
        form.setValue('id_podotchet_litso', 0)
      }
    })
  )

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: form.watch('id_shartnomalar_organization'),
      onChange: (value) => {
        form.setValue('id_shartnomalar_organization', value, { shouldValidate: true })
      },
      params: {
        organ_id: form.watch('id_spravochnik_organization')
      }
    })
  )

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: form.watch('id_podotchet_litso'),
      onChange: (value) => {
        form.setValue('id_podotchet_litso', value, { shouldValidate: true })
        form.setValue('main_zarplata_id', 0)
        form.setValue('id_spravochnik_organization', 0)
      }
    })
  )

  const mainZarplataSpravochnik = useSpravochnik(
    createMainZarplataSpravochnik({
      value: form.watch('main_zarplata_id'),
      onChange: (id) => {
        form.setValue('main_zarplata_id', id, { shouldValidate: true })
        form.setValue('id_podotchet_litso', 0)
        form.setValue('id_spravochnik_organization', 0)
      }
    })
  )

  const { data: main_schet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById,
    enabled: !!main_schet_id
  })
  const {
    data: prixod,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      PrixodQueryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: KassaPrixodService.getById,
    enabled: id !== 'create'
  })

  const { mutate: createPrixod, isPending: isCreating } = useMutation({
    mutationFn: KassaPrixodService.create,
    onSuccess(res) {
      toast.success(res.message)

      queryClient.invalidateQueries({
        queryKey: [PrixodQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [PrixodQueryKeys.getById, id]
      })

      navigate(-1)
      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })

  const { mutate: updatePrixod, isPending: isUpdating } = useMutation({
    mutationFn: KassaPrixodService.update,
    onSuccess(res) {
      toast.success(res.message)

      queryClient.invalidateQueries({
        queryKey: [PrixodQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [PrixodQueryKeys.getById, id]
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
      type,
      id_podotchet_litso,
      main_zarplata_id,
      id_spravochnik_organization,
      id_shartnomalar_organization,
      organization_by_raschet_schet_gazna_id,
      organization_by_raschet_schet_id,
      shartnoma_grafik_id
    }) => {
      if (id !== 'create') {
        updatePrixod({
          id: Number(id),
          doc_date,
          doc_num,
          id_podotchet_litso,
          main_zarplata_id,
          type: type === PrixodType.Organ ? PrixodType.Organ : PrixodType.Podotchet,
          opisanie,
          contract_id: id_shartnomalar_organization,
          contract_grafik_id: shartnoma_grafik_id,
          organ_id: id_spravochnik_organization,
          organ_gazna_id: organization_by_raschet_schet_gazna_id,
          organ_account_id: organization_by_raschet_schet_id,
          childs: podvodki.map(normalizeEmptyFields<PrixodProvodkaFormValues>)
        })
        return
      }
      createPrixod({
        doc_date,
        doc_num,
        id_podotchet_litso,
        main_zarplata_id,
        type: type === PrixodType.Organ ? PrixodType.Organ : PrixodType.Podotchet,
        opisanie,
        contract_id: id_shartnomalar_organization,
        contract_grafik_id: shartnoma_grafik_id,
        organ_id: id_spravochnik_organization,
        organ_gazna_id: organization_by_raschet_schet_gazna_id,
        organ_account_id: organization_by_raschet_schet_id,
        childs: podvodki.map(normalizeEmptyFields<PrixodProvodkaFormValues>)
      })
    }
  )

  const podvodki = useWatch({
    control: form.control,
    name: 'childs'
  })

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
      form.reset({
        ...defaultValues,
        doc_date: formatDate(startDate)
      })
      return
    }

    form.reset({
      doc_num: prixod.data.doc_num,
      doc_date: prixod.data.doc_date,
      opisanie: prixod.data.opisanie,
      id_podotchet_litso: prixod.data.id_podotchet_litso,
      id_shartnomalar_organization: prixod.data.contract_id,
      id_spravochnik_organization: prixod.data.organ_id,
      organization_by_raschet_schet_gazna_id: prixod.data.organ_gazna_id,
      organization_by_raschet_schet_id: prixod.data.organ_account_id,
      main_zarplata_id: prixod.data.main_zarplata_id,
      childs: prixod.data.childs,
      type: prixod.data.main_zarplata_id
        ? PrixodType.Zarplata
        : prixod.data.organ_id
          ? PrixodType.Organ
          : PrixodType.Podotchet
    })
  }, [form, prixod, id])

  console.log({ childs: form.watch('childs') })

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
                <div className="col-span-2 p-5 border-b border-slate-100 flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex items-center gap-10"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={PrixodType.Podotchet}
                            id={PrixodType.Podotchet}
                          />
                          <Label htmlFor={PrixodType.Podotchet}>{t('podotchet-litso')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={PrixodType.Organ}
                            id={PrixodType.Organ}
                          />
                          <Label htmlFor={PrixodType.Organ}>{t('organization')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={PrixodType.Zarplata}
                            id={PrixodType.Zarplata}
                          />
                          <Label htmlFor={PrixodType.Zarplata}>{t('zarplata')}</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                {form.watch('type') === PrixodType.Zarplata ? (
                  <MainZarplataFields
                    tabIndex={2}
                    spravochnik={mainZarplataSpravochnik}
                    error={form.formState.errors.main_zarplata_id}
                  />
                ) : form.watch('type') === PrixodType.Podotchet ? (
                  <PodotchetFields
                    tabIndex={2}
                    spravochnik={podotchetSpravochnik}
                    error={form.formState.errors.id_podotchet_litso}
                  />
                ) : (
                  <OrganizationFields
                    displayGazna
                    spravochnik={organSpravochnik}
                    form={form as any}
                    error={form.formState.errors.id_spravochnik_organization}
                  />
                )}
                <div className="h-full divide-y">
                  <SummaFields data={{ summa: form.watch('summa') }} />
                  {form.watch('type') === PrixodType.Organ ? (
                    <ShartnomaFields
                      disabled={!form.watch('id_spravochnik_organization')}
                      spravochnik={shartnomaSpravochnik}
                    />
                  ) : null}
                </div>
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
            form={form}
            name="childs"
            columnDefs={podvodkaColumns}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: PrixodPodvodkaFormSchema,
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

export default KassaPrixodDetailsPage
