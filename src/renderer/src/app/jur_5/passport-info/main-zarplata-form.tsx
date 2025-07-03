import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'

import { type ReactNode, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calculator } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ZarplataSpravochnikType } from '@/app/super-admin/zarplata/spravochnik/config'
import {
  ZarplataSpravochnikService,
  createZarplataSpravochnik
} from '@/app/super-admin/zarplata/spravochnik/service'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { DissmisEmployee } from '@/common/features/main-zarplata/dismiss-main-zarplata-dialog'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, parseDate, parseLocaleDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { getVacantRayon } from '../common/utils/vacant'
import { MainZarplataFormSchema, defaultValues } from './config'

export interface MainZarplataFormProps {
  isCalculating?: boolean
  vacant: VacantTreeNode
  selectedMainZarplata?: MainZarplata | undefined
  content?: ReactNode
  onCalculate?: (id: number) => void
  onRemovePosition?: (id: number) => void
  onCreate?: (user: MainZarplata) => void
  onClose?: VoidFunction
}
export const MainZarplataForm = ({
  isCalculating = false,
  vacant,
  selectedMainZarplata,
  content,
  onCalculate,
  onCreate,
  onClose
}: MainZarplataFormProps) => {
  const { t } = useTranslation()

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
        className="h-full p-5 pr-0 flex flex-col"
      >
        <div className="flex flex-wrap gap-2.5 flex-1 overflow-auto scrollbar pr-5">
          <div className="flex-1 p-2.5 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] content-center gap-5">
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
                    buttonRef={field.ref}
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
                  <JollyDatePicker {...field} onChange={dateString => {
                    field.onChange(dateString)
                    const { years, months, days } = calculateDateDifference(parseDate(dateString), new Date())
                    form.setValue('visNa1Year', years)
                    form.setValue('month1', months)
                    form.setValue('day1', days)
                  }} />
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
          </div>
          <div className="p-10">
            <div className="flex flex-col items-center gap-10">
              <div className="border w-[200px] h-[calc(200px/3*4)] bg-gray-100 rounded-lg">
                <img
                  src="/images/profile_placeholder.png"
                  alt="Profile placeholder"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <TimeElapsed start={form.watch('nachaloSlujbi')} />
              <div className="flex flex-col gap-2">
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
          <div className="w-full">{content}</div>
        </div>

        <div className="w-full pt-5">
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

const calculateDateDifference = (startDate: Date, endDate: Date) => {
  if (!(startDate instanceof Date)) startDate = new Date(startDate)
  if (!(endDate instanceof Date)) endDate = new Date(endDate)

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  let days = endDate.getDate() - startDate.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

const TimeElapsed = ({ start }: { start: string }) => {
  if (!start) return null

  const { t } = useTranslation()
  const { years, months, days } = 

  const FlipCard = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2">
      <div className="bg-black text-white text-3xl font-mono rounded-md px-4 py-2 shadow-inner border-2 border-gray-700 min-w-[60px] text-center select-none flex flex-col items-center justify-center">
        <span>{value}</span>
        <span className="text-xs text-gray-300 mt-1">{label}</span>
      </div>
    </div>
  )

  return (
    <div className="flex items-end gap-2">
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
