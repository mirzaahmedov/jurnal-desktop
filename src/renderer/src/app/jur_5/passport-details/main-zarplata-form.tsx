import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'

import { type ReactNode, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calculator } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useAsyncListBank } from '@/app/super-admin/bank/service'
import { ZarplataSpravochnikType } from '@/app/super-admin/zarplata/spravochnik/config'
import {
  ZarplataSpravochnikService,
  createZarplataSpravochnik
} from '@/app/super-admin/zarplata/spravochnik/service'
import placeholderImage from '@/common/assets/images/profile_placeholder.png'
import { Fieldset, NumericInput } from '@/common/components'
import { AutoComplete } from '@/common/components/auto-complete'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { ComboboxItem } from '@/common/components/jolly/combobox'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { DissmisEmployee } from '@/common/features/main-zarplata/dismiss-main-zarplata-dialog'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, getDateDifference, parseDate, parseLocaleDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { normalizeSpaces } from '@/common/lib/text'
import { cn } from '@/common/lib/utils'

import { getVacantRayon } from '../common/utils/vacant'
import { MainZarplataFormSchema, defaultValues } from './config'

export interface MainZarplataFormProps {
  isCalculating?: boolean
  vacant: VacantTreeNode
  selectedMainZarplata?: MainZarplata | undefined
  content?: ReactNode
  workplace?: ReactNode
  onCalculate?: (id: number) => void
  onCreate?: (user: MainZarplata) => void
  onClose?: VoidFunction
  naRuki?: number
}
export const MainZarplataForm = ({
  isCalculating = false,
  vacant,
  selectedMainZarplata,
  content,
  workplace,
  onCalculate,
  onCreate,
  onClose,
  naRuki
}: MainZarplataFormProps) => {
  const { t } = useTranslation()

  const bankList = useAsyncListBank()
  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(MainZarplataFormSchema),
    defaultValues
  })

  const { data: grafiks } = useQuery({
    queryKey: [
      ZarplataSpravochnikService.QueryKeys.GetAll,
      {
        page: 1,
        limit: 100000,
        types_type_code: ZarplataSpravochnikType.GrafikRaboty
      }
    ],
    queryFn: ZarplataSpravochnikService.getAll
  })
  const { mutate: createMainZarplata, isPending: isCreating } = useMutation({
    mutationFn: MainZarplataService.create,
    onSuccess: (res) => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, selectedMainZarplata?.id ?? 0]
      })
      onClose?.()
      if (res?.data) {
        onCreate?.(res.data)
      }
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const { mutate: updateMainZarplata, isPending: isUpdating } = useMutation({
    mutationFn: MainZarplataService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, selectedMainZarplata?.id ?? 0]
      })
      onClose?.()
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const zarplataZvanieSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      value: form.watch('spravochikZarplataZvanieId'),
      onChange: (value) => form.setValue('spravochikZarplataZvanieId', value ?? 0),
      params: {
        types_type_code: ZarplataSpravochnikType.Zvanie
      }
    })
  )

  const handleSubmit = form.handleSubmit((values) => {
    if (selectedMainZarplata) {
      updateMainZarplata({
        id: selectedMainZarplata.id,
        values: {
          ...values,
          dateBirth: formatLocaleDate(values.dateBirth),
          nachaloSlujbi: formatLocaleDate(values.nachaloSlujbi),
          vacantId: vacant.id
        }
      })
    } else {
      createMainZarplata({
        ...values,
        dateBirth: formatLocaleDate(values.dateBirth),
        nachaloSlujbi: formatLocaleDate(values.nachaloSlujbi),
        vacantId: vacant.id
      })
    }
  })

  useEffect(() => {
    if (selectedMainZarplata) {
      form.reset({
        ...selectedMainZarplata,
        dateBirth: formatDate(parseLocaleDate(selectedMainZarplata.dateBirth)),
        nachaloSlujbi: formatDate(parseLocaleDate(selectedMainZarplata.nachaloSlujbi))
      })
    } else {
      form.reset(defaultValues)
    }
  }, [selectedMainZarplata, vacant, form])
  useEffect(() => {
    form.setValue('rayon', getVacantRayon(vacant))
  }, [vacant])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="h-full px-0 flex flex-col"
      >
        <div className="grid grid-cols-12 gap-2.5 flex-1 overflow-auto justify-center items-start scrollbar px-2.5 pb-5">
          <div
            className={cn(
              'col-span-3 max-[1000px]:col-span-full',
              workplace && 'max-[1400px]:col-span-6 '
            )}
          >
            <div className="flex flex-col items-center gap-5">
              <div className="border w-[200px] h-[calc(200px/3*4)] bg-gray-100 rounded-lg">
                <img
                  src={placeholderImage}
                  alt="Profile placeholder"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <TimeElapsed
                years={form.watch('visNa1Year') ?? 0}
                months={form.watch('month1') ?? 0}
                days={form.watch('day1') ?? 0}
              />
              <div className="flex flex-col gap-2 py-1">
                {onCalculate ? (
                  <Button
                    onClick={() => onCalculate?.(selectedMainZarplata?.id ?? 0)}
                    isDisabled={!selectedMainZarplata || isCalculating || isUpdating || isCreating}
                    className="mb-2"
                  >
                    <Calculator className="btn-icon icon-start" /> {t('calculate_salary')}
                  </Button>
                ) : null}
                {selectedMainZarplata ? (
                  <DissmisEmployee mainZarplataId={selectedMainZarplata.id} />
                ) : null}
              </div>
            </div>
          </div>
          <div
            className={cn(
              'col-span-full lg:col-span-9 flex-1 p-2.5 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] content-center gap-2.5',
              workplace && 'lg:col-span-6 max-[1400px]:col-span-6'
            )}
          >
            <div>
              <FormField
                control={form.control}
                name="kartochka"
                render={({ field }) => (
                  <FormElement
                    direction="column"
                    label={t('card_num')}
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />
              <div>
                <FormField
                  control={form.control}
                  name="xarbiy"
                  render={({ field }) => (
                    <FormElement
                      label={t('military')}
                      divProps={{ className: 'flex-row-reverse justify-end' }}
                      innerProps={{ className: 'flex-none w-auto' }}
                    >
                      <Checkbox
                        ref={field.ref}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ostanovitRaschet"
                  render={({ field }) => (
                    <FormElement
                      label={t('stop_calculation')}
                      divProps={{ className: 'flex-row-reverse justify-end' }}
                      innerProps={{ className: 'flex-none w-auto' }}
                    >
                      <Checkbox
                        ref={field.ref}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormElement>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="fio"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('fio')}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="dateBirth"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('date_of_birth')}
                >
                  <JollyDatePicker {...field} />
                </FormElement>
              )}
            />

            <FormField
              control={form.control}
              name="spravochnikZarplataGrafikRabotiId"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('grafik')}
                >
                  <JollySelect
                    inputRef={field.ref}
                    items={grafiks?.data || []}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  >
                    {(item) => <SelectItem>{item.name}</SelectItem>}
                  </JollySelect>
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="nachaloSlujbi"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('start_of_service')}
                >
                  <JollyDatePicker
                    {...field}
                    onChange={(dateString) => {
                      field.onChange(dateString)
                      const { years, months, days } = getDateDifference(
                        parseDate(dateString),
                        new Date()
                      )
                      form.setValue('visNa1Year', years)
                      form.setValue('month1', months)
                      form.setValue('day1', days)
                    }}
                  />
                </FormElement>
              )}
            />

            <FormField
              control={form.control}
              name="spravochikZarplataZvanieId"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('military_rank')}
                >
                  <SpravochnikInput
                    {...zarplataZvanieSpravochnik}
                    inputRef={field.ref}
                    getInputValue={(selected) => selected?.name || ''}
                  />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="inn"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('inn')}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />

            <FormField
              control={form.control}
              name="inps"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('inps')}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />

            <div>
              <FormField
                control={form.control}
                name="rayon"
                render={({ field }) => (
                  <FormElement
                    direction="column"
                    label={t('rayon')}
                  >
                    <Textarea
                      {...field}
                      readOnly
                    />
                  </FormElement>
                )}
              />
            </div>
            {naRuki !== undefined ? (
              <FormElement
                direction="column"
                label={t('na_ruki')}
              >
                <NumericInput
                  readOnly
                  value={naRuki}
                />
              </FormElement>
            ) : null}
          </div>

          <div className="max-[1400px]:col-span-full col-span-3 max-[1400px]:grid place-items-center">
            {workplace}

            <div className="rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-300 p-0 shadow-md font-sans flex flex-col justify-between my-5">
              <Fieldset
                name={t('bank_card')}
                className="gap-2.5 p-4"
                legendProps={{
                  className: 'text-inherit uppercase m-1'
                }}
              >
                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormElement
                      grid="2:5"
                      label={t('bank')}
                    >
                      <AutoComplete
                        items={bankList.items}
                        inputValue={bankList.filterText}
                        onInputChange={bankList.setFilterText}
                        selectedKey={field.value}
                        onSelectionChange={(key) => {
                          field.onChange(key)
                        }}
                      >
                        {(item) => (
                          <ComboboxItem id={item.bank_name}>
                            {item.mfo} - {normalizeSpaces(item.bank_name)}
                          </ComboboxItem>
                        )}
                      </AutoComplete>
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="raschetSchet"
                  render={({ field }) => (
                    <FormElement
                      grid="2:5"
                      label={t('card_number')}
                    >
                      <Input
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fioDop"
                  render={({ field }) => (
                    <FormElement
                      grid="2:5"
                      label={t('fio')}
                    >
                      <Input
                        {...field}
                        placeholder={t('fio')}
                      />
                    </FormElement>
                  )}
                />
              </Fieldset>
            </div>
          </div>
          <div className="col-span-full">{content}</div>
        </div>

        <div className={cn('w-full pt-5 border-t', workplace && 'p-5')}>
          <Button
            type="submit"
            isPending={isCreating || isUpdating}
          >
            {t('save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface TimeElapsedProps {
  years: number
  months: number
  days: number
}
const TimeElapsed = ({ years, months, days }: TimeElapsedProps) => {
  const { t } = useTranslation()
  const FlipCard = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2">
      <div className="bg-black text-white text-3xl font-mono rounded-md px-4 py-2 shadow-inner border-2 border-gray-700 min-w-[60px] text-center select-none flex flex-col items-center justify-center">
        <span>{value}</span>
        <span className="text-xs text-gray-300 mt-1">{label}</span>
      </div>
    </div>
  )

  return (
    <div className="flex items-end gap-1">
      <FlipCard
        value={years}
        label={t('year')}
      />
      <FlipCard
        value={months}
        label={t('month')}
      />
      <FlipCard
        value={days}
        label={t('day')}
      />
    </div>
  )
}
