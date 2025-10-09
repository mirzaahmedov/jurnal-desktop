import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'

import { type ReactNode, useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Transliterator from 'lotin-kirill'
import { Calculator } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ZarplataSpravochnikType } from '@/app/super-admin/zarplata/spravochnik/config'
import {
  ZarplataSpravochnikService,
  createZarplataSpravochnik
} from '@/app/super-admin/zarplata/spravochnik/service'
import placeholderImage from '@/common/assets/images/profile_placeholder.png'
import { LoadingOverlay, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { PersonService } from '@/common/features/integrations/person/service'
import { DissmisEmployee } from '@/common/features/main-zarplata/dismiss-main-zarplata-dialog'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, getDateDifference, parseDate, parseLocaleDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

import { getVacantRayon } from '../../common/utils/vacant'
import { BankCardForm } from '../bank-card/bank-card-form'
import { MainZarplataFormSchema, defaultValues } from '../config'

const transliterator = new Transliterator()

export interface MainZarplataFormProps {
  isCalculating?: boolean
  vacant: VacantTreeNode | null
  mainZarplataData?: MainZarplata | undefined
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
  mainZarplataData,
  content,
  workplace,
  onCalculate,
  onCreate,
  onClose,
  naRuki
}: MainZarplataFormProps) => {
  const { t } = useTranslation()

  const [profileImage, setProfileImage] = useState<string>()

  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(MainZarplataFormSchema),
    defaultValues
  })

  const getPersonByPnflMutation = useMutation({
    mutationFn: PersonService.getByPnfl,
    onSuccess: (res) => {
      try {
        if (res?.data?.length && res?.data?.[0]?.photo) {
          setProfileImage(res?.data?.[0].photo ?? undefined)
        } else {
          setProfileImage(undefined)
        }

        if (res?.data?.[0]) {
          const fio = `${res?.data?.[0]?.surnamelat ?? ''} ${res?.data?.[0]?.namelat ?? ''} ${res?.data?.[0]?.patronymlat ?? ''}`
          form.setValue('fio', fio ?? '')
          form.setValue('fioDop', fio ?? '')
        }
      } catch (error) {
        console.log(error)
        setProfileImage(undefined)
      }
    },
    onError: (error) => {
      console.log({ error })
      setProfileImage(undefined)
    }
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
        queryKey: [MainZarplataService.QueryKeys.GetByVacantId]
      })
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, mainZarplataData?.id ?? 0]
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
        queryKey: [MainZarplataService.QueryKeys.GetByVacantId]
      })
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, mainZarplataData?.id ?? 0]
      })
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
    if (mainZarplataData) {
      updateMainZarplata({
        id: mainZarplataData.id,
        values: {
          ...values,
          dateBirth: formatLocaleDate(values.dateBirth),
          nachaloSlujbi: formatLocaleDate(values.nachaloSlujbi),
          vacantId: mainZarplataData.vacantId
        }
      })
    } else {
      if (!vacant) {
        toast.error(t('select_vacant_first'))
        return
      }
      createMainZarplata({
        ...values,
        dateBirth: formatLocaleDate(values.dateBirth),
        nachaloSlujbi: formatLocaleDate(values.nachaloSlujbi),
        vacantId: vacant.id
      })
    }
  })

  useEffect(() => {
    if (mainZarplataData) {
      form.reset({
        ...mainZarplataData,
        dateBirth: formatDate(parseLocaleDate(mainZarplataData.dateBirth)),
        nachaloSlujbi: formatDate(parseLocaleDate(mainZarplataData.nachaloSlujbi)),
        isPremya: mainZarplataData.isPremya ?? undefined
      })
    } else {
      form.reset(defaultValues)
    }
  }, [mainZarplataData, vacant, form])
  useEffect(() => {
    if (mainZarplataData) {
      return
    }

    if (vacant) {
      form.setValue('rayon', getVacantRayon(vacant))
    } else {
      form.setValue('rayon', '')
    }
  }, [mainZarplataData, vacant])

  const pnfl = form.watch('inps')
  const dateBirth = form.watch('dateBirth')

  useEffect(() => {
    if (pnfl?.length === 14 && dateBirth) {
      getPersonByPnflMutation.mutate({
        pinpp: pnfl,
        birth_date: dateBirth
      })
    } else {
      setProfileImage(undefined)
    }
  }, [pnfl, dateBirth])

  const startOfYear = new Date()
  startOfYear.setMonth(0)
  startOfYear.setDate(1)
  const timeElapsedUntilStartOfYear = getDateDifference(
    parseDate(form.watch('nachaloSlujbi')),
    startOfYear
  )

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
              <div className="border w-[200px] h-[calc(200px/3*4)] bg-gray-100 rounded-lg relative">
                {getPersonByPnflMutation.isPending ? <LoadingOverlay /> : null}
                {profileImage ? (
                  <img
                    src={`data:image/png;base64,${profileImage}`}
                    alt="Profile picture"
                    className="w-full h-full object-cover object-center rounded-md"
                  />
                ) : (
                  <img
                    src={placeholderImage}
                    alt="Profile placeholder"
                    className="w-full h-full object-cover object-center rounded-md"
                  />
                )}
              </div>
              <TimeElapsed
                years={form.watch('visNa1Year') ?? 0}
                months={form.watch('month1') ?? 0}
                days={form.watch('day1') ?? 0}
                label={t('time_elapsed_until_today')}
              />
              <TimeElapsed
                years={timeElapsedUntilStartOfYear.years}
                months={timeElapsedUntilStartOfYear.months}
                days={timeElapsedUntilStartOfYear.days}
                label={t('time_elapsed_until_start_of_year')}
              />
              <div className="flex flex-col gap-2 py-1">
                {onCalculate ? (
                  <Button
                    onClick={() => onCalculate?.(mainZarplataData?.id ?? 0)}
                    isDisabled={!mainZarplataData || isCalculating || isUpdating || isCreating}
                    className="mb-2"
                  >
                    <Calculator className="btn-icon icon-start" /> {t('calculate_salary')}
                  </Button>
                ) : null}
                {mainZarplataData ? <DissmisEmployee mainZarplataId={mainZarplataData.id} /> : null}
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
            </div>
            <div className="col-span-full flex items-center flex-wrap gap-10">
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
                name="isPremya"
                render={({ field }) => (
                  <FormElement
                    label={t('dont_give_premya')}
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
                name="isLigota"
                render={({ field }) => (
                  <FormElement
                    label={t('ligota')}
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
            <FormField
              control={form.control}
              name="fio"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('fio')}
                >
                  <Input
                    {...field}
                    onChange={(e) => {
                      form.setValue('fioDop', transliterator.textToLatin(e.target.value ?? ''))
                      field.onChange(e)
                    }}
                  />
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
            <FormField
              control={form.control}
              name="categoryNum"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('category_num')}
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
              name="categoryName"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('category_name')}
                >
                  <Input
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormElement>
              )}
            />
          </div>

          <div className="max-[1400px]:col-span-full col-span-3 max-[1400px]:grid place-items-center">
            {workplace}
          </div>
          <div className="col-span-full">
            {!mainZarplataData ? <BankCardForm form={form} /> : null}
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
  label: string
  years: number
  months: number
  days: number
}
const TimeElapsed = ({ label, years, months, days }: TimeElapsedProps) => {
  const { t } = useTranslation()
  const FlipCard = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-1">
      <div className="bg-black text-white text-xl font-mono rounded px-2 py-1 shadow-inner border border-gray-700 min-w-[60px] text-center select-none flex flex-col items-center justify-center">
        <span>{value}</span>
        <span className="text-[10px] text-gray-300 mt-0.5">{label}</span>
      </div>
    </div>
  )

  return (
    <div className="w-full flex flex-col items-start gap-1 rounded-md min-w-[180px] max-w-full mb-1">
      <div className="w-full flex items-center justify-center gap-1 mb-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
        <h6 className="text-xs font-semibold text-gray-800">{label}</h6>
      </div>
      <div className="w-full flex items-end justify-center gap-0.5">
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
    </div>
  )
}
