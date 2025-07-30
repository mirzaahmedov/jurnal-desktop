import type { KassaRasxodFormValues, KassaRasxodPodvodkaFormValues } from '../config'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { KassaMonitorQueryKeys, KassaMonitorService } from '@/app/jur_1/monitor'
import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { AccountBalance, Fieldset } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { Form, FormField } from '@/common/components/ui/form'
import { Label } from '@/common/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group'
import { DocumentType } from '@/common/features/doc-num'
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
import { formatDate } from '@/common/lib/date'
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

import { useKassaSaldo } from '../../saldo/components/use-saldo'
import {
  KassaRasxodFormSchema,
  KassaRasxodPodvodkaFormSchema,
  KassaRasxodQueryKeys,
  RasxodType,
  defaultValues
} from '../config'
import { KassaRasxodService } from '../service'
import { podvodkaColumns } from './podvodki'

export interface KassaRasxodDetailsProps {
  id: string | undefined
  onSuccess?: VoidFunction
}
export const KassaRasxodDetails = ({ id, onSuccess }: KassaRasxodDetailsProps) => {
  const { t } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'kassa_rasxod'
  })
  const { queuedMonths } = useKassaSaldo()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const queryClient = useQueryClient()

  const { startDate, endDate } = useSelectedMonthStore()

  const now = new Date()
  const defaultDate = () =>
    startDate <= now && now <= endDate ? formatDate(now) : formatDate(startDate)

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const form = useForm({
    resolver: zodResolver(KassaRasxodFormSchema),
    defaultValues: {
      ...defaultValues,
      doc_date: defaultDate()
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
      }
    })
  )

  const {
    data: monitor,
    isFetching: isFetchingMonitor,
    error
  } = useQuery({
    queryKey: [
      KassaMonitorQueryKeys.getAll,
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
    queryFn: KassaMonitorService.getAll,
    enabled: !!form.watch('doc_date') && !queuedMonths.length
  })
  const { data: rasxod, isFetching } = useQuery({
    queryKey: [
      KassaRasxodQueryKeys.getById,
      Number(id),
      {
        main_schet_id: main_schet_id
      }
    ],
    queryFn: KassaRasxodService.getById,
    enabled: id !== 'create' && !queuedMonths.length
  })
  const { mutate: createRasxod, isPending: isCreating } = useMutation({
    mutationFn: KassaRasxodService.create,
    onSuccess(res) {
      toast.success(res?.message)

      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [KassaRasxodQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [KassaRasxodQueryKeys.getById, id]
      })

      onSuccess?.()
      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })
  const { mutate: updateRasxod, isPending: isUpdating } = useMutation({
    mutationFn: KassaRasxodService.update,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [KassaRasxodQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [KassaRasxodQueryKeys.getById, id]
      })

      onSuccess?.()
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
    }: KassaRasxodFormValues) => {
      if (id !== 'create') {
        updateRasxod({
          id: Number(id),
          doc_date,
          doc_num,
          id_podotchet_litso,
          main_zarplata_id,
          type: type === RasxodType.Organ ? RasxodType.Organ : RasxodType.Podotchet,
          opisanie,
          contract_id: id_shartnomalar_organization,
          contract_grafik_id: shartnoma_grafik_id,
          organ_id: id_spravochnik_organization,
          organ_gazna_id: organization_by_raschet_schet_gazna_id,
          organ_account_id: organization_by_raschet_schet_id,
          childs: podvodki.map(normalizeEmptyFields<KassaRasxodPodvodkaFormValues>)
        })
        return
      }
      createRasxod({
        doc_date,
        doc_num,
        id_podotchet_litso,
        main_zarplata_id,
        type: type === RasxodType.Organ ? RasxodType.Organ : RasxodType.Podotchet,
        opisanie,
        contract_id: id_shartnomalar_organization,
        contract_grafik_id: shartnoma_grafik_id,
        organ_id: id_spravochnik_organization,
        organ_gazna_id: organization_by_raschet_schet_gazna_id,
        organ_account_id: organization_by_raschet_schet_id,
        childs: podvodki.map(normalizeEmptyFields<KassaRasxodPodvodkaFormValues>)
      })
    }
  )

  const podvodki = useWatch({
    control: form.control,
    name: 'childs'
  })

  const summa = form.watch('summa')
  const reminder = monitor?.meta
    ? (monitor?.meta?.summa_to ?? 0) -
      (summa ?? 0) +
      (rasxod?.data?.summa ? Number(rasxod?.data?.summa) : 0)
    : 0

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
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
    if (id === 'create' || !rasxod?.data) {
      form.reset({
        ...defaultValues,
        doc_date: defaultDate()
      })
      return
    }

    form.reset({
      doc_num: rasxod.data.doc_num,
      doc_date: rasxod.data.doc_date,
      opisanie: rasxod.data.opisanie,
      id_podotchet_litso: rasxod.data.id_podotchet_litso,
      id_shartnomalar_organization: rasxod.data.contract_id,
      id_spravochnik_organization: rasxod.data.organ_id,
      organization_by_raschet_schet_gazna_id: rasxod.data.organ_gazna_id,
      organization_by_raschet_schet_id: rasxod.data.organ_account_id,
      main_zarplata_id: rasxod.data.main_zarplata_id,
      childs: rasxod.data.childs,
      type: rasxod.data.main_zarplata_id
        ? RasxodType.Zarplata
        : rasxod.data.organ_id
          ? RasxodType.Organ
          : RasxodType.Podotchet
    })
  }, [form, rasxod, id])

  return (
    <DetailsView>
      <DetailsView.Content isLoading={isFetching}>
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
                            value={RasxodType.Podotchet}
                            id={RasxodType.Podotchet}
                          />
                          <Label htmlFor={RasxodType.Podotchet}>{t('podotchet-litso')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={RasxodType.Organ}
                            id={RasxodType.Organ}
                          />
                          <Label htmlFor={RasxodType.Organ}>{t('organization')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={RasxodType.Zarplata}
                            id={RasxodType.Zarplata}
                          />
                          <Label htmlFor={RasxodType.Zarplata}>{t('zarplata')}</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                {form.watch('type') === RasxodType.Zarplata ? (
                  <MainZarplataFields
                    tabIndex={2}
                    spravochnik={mainZarplataSpravochnik}
                    error={form.formState.errors.main_zarplata_id}
                  />
                ) : form.watch('type') === RasxodType.Podotchet ? (
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
                  {form.watch('type') === RasxodType.Organ ? (
                    <ShartnomaFields
                      disabled={!form.watch('id_spravochnik_organization')}
                      form={form as any}
                      spravochnik={shartnomaSpravochnik}
                    />
                  ) : null}
                </div>
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
                isDisabled={
                  reminder < 0 || isFetchingMonitor || isFetching || isUpdating || isCreating
                }
                isPending={isCreating || isUpdating}
                tabIndex={5}
              />

              {!form.watch('doc_date') || isFetchingMonitor ? null : (
                <AccountBalance balance={reminder} />
              )}
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name={t('provodka')}
          className="flex-1 mt-10 pb-20 bg-slate-50"
        >
          <EditableTable
            tabIndex={4}
            form={form}
            name="childs"
            columnDefs={podvodkaColumns}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: KassaRasxodPodvodkaFormSchema,
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
