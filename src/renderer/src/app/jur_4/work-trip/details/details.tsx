import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { OperatsiiService, operatsiiQueryKeys } from '@/app/super-admin/operatsii'
import { MinimumWageService } from '@/app/super-admin/spravochnik/minimum-wage/service'
import { Fieldset, NumericInput } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { DocumentType } from '@/common/features/doc-num'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, getDaysCount, parseDate, withinMonth } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'
import { TypeSchetOperatsii } from '@/common/models'
import { DetailsView } from '@/common/views'
import { DocumentFields, PodotchetFields, SummaFields } from '@/common/widget/form'

import { WorkTripFormSchema, WorkTripQueryKeys, defaultValues } from '../config'
import { WorkTripService } from '../service'
import { WorkTripProvodkaColumns } from './provodki'
import { calcDailySumma } from './utils'
import { WorkTripHotels } from './work-trip-hotels'
import { WorkTripRoads } from './work-trip-roads'

export interface WorkTripDetailsProps {
  id: string
}
export const WorkTripDetails = ({ id }: WorkTripDetailsProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { startDate } = useSelectedMonthStore()

  const { t } = useTranslation(['app'])
  const { main_schet_id, jur4_schet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      doc_date: formatDate(startDate)
    },
    resolver: zodResolver(WorkTripFormSchema)
  })

  const { mutate: createWorkTrip, isPending: isCreatingWorkTrip } = useMutation({
    mutationFn: WorkTripService.create,
    onSuccess: (res) => {
      toast.success(res.message)

      queryClient.invalidateQueries({
        queryKey: [WorkTripQueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkTripQueryKeys.GetById, id]
      })

      navigate(-1)
    }
  })
  const { mutate: updateWorkTrip, isPending: isUpdatingWorkTrip } = useMutation({
    mutationFn: WorkTripService.update,
    onSuccess: (res) => {
      toast.success(res.message)

      queryClient.invalidateQueries({
        queryKey: [WorkTripQueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkTripQueryKeys.GetById, id]
      })

      navigate(-1)
    }
  })

  const { data: workTrip, isFetching } = useQuery({
    queryKey: [
      WorkTripQueryKeys.GetById,
      Number(id),
      {
        main_schet_id,
        schet_id: jur4_schet_id
      }
    ],
    queryFn: WorkTripService.getById,
    enabled: id !== 'create'
  })
  const { data: minimumWage, isFetching: isFetchingMinimumWage } = useQuery({
    queryKey: [MinimumWageService.QueryKeys.GetWage],
    queryFn: MinimumWageService.getWage
  })

  const { data: operatsii } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getAll,
      {
        type_schet: TypeSchetOperatsii.WORK_TRIP,
        page: 1,
        limit: 1
      }
    ],
    queryFn: OperatsiiService.getAll
  })

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: form.watch('worker_id'),
      onChange: (value) => form.setValue('worker_id', value ?? 0)
    })
  )

  const handleSubmit = form.handleSubmit((values) => {
    if (id === 'create') {
      createWorkTrip(values)
    } else {
      updateWorkTrip({
        id: Number(id),
        ...values
      })
    }
  })

  const childs = useWatch({
    control: form.control,
    name: 'childs'
  })
  useEffect(() => {
    form.setValue('summa', childs.reduce((acc, child) => acc + (child.summa ?? 0), 0) as number)
  }, [childs, form])
  useEffect(() => {
    if (workTrip?.data) {
      form.reset(workTrip?.data)
    } else {
      form.reset({
        ...defaultValues,
        doc_date: formatDate(useSelectedMonthStore.getState().startDate)
      })
    }
  }, [workTrip?.data, form])
  useEffect(() => {
    if (
      !form.getValues('doc_date') ||
      !withinMonth(parseDate(form.getValues('doc_date')), startDate)
    ) {
      form.setValue('doc_date', formatDate(startDate))
    }
  }, [form, startDate])

  const minimumWageSumma = minimumWage?.data?.summa ?? 0
  const daysCount =
    form.watch('from_date') && form.watch('to_date')
      ? getDaysCount({
          startDate: parseDate(form.watch('from_date')),
          endDate: parseDate(form.watch('to_date'))
        })
      : 0

  useEffect(() => {
    const firstOperatsii = operatsii?.data?.[0]
    if (firstOperatsii) {
      form.setValue(
        'childs',
        form.getValues('childs').map((child) => ({
          ...child,
          schet_id: child.schet_id ? child.schet_id : firstOperatsii.id
        }))
      )
    }
  }, [form, operatsii?.data])
  useEffect(() => {
    const daySumma = calcDailySumma({
      minimumWageSumma,
      daysCount
    })
    form.setValue('day_summa', daySumma)
    form.setValue(
      'childs',
      form.getValues('childs').map((child) =>
        child.type === 'day'
          ? {
              ...child,
              summa: daySumma
            }
          : child
      )
    )
  }, [minimumWageSumma, daysCount])

  const roads = useWatch({
    control: form.control,
    name: 'road'
  })
  useEffect(() => {
    if (!Array.isArray(roads)) {
      return
    }
    const roadsSumma = roads.reduce((acc, road) => acc + (road.road_summa ?? 0), 0)
    const childIndex = form.getValues('childs').findIndex((child) => child.type === 'road')
    if (childIndex !== -1 && roadsSumma !== form.getValues(`childs.${childIndex}.summa`)) {
      form.setValue(`childs.${childIndex}.summa`, roadsSumma)
    }
    if (roadsSumma !== form.getValues('road_summa')) {
      form.setValue('road_summa', roadsSumma)
    }
  }, [roads])

  const hotels = useWatch({
    control: form.control,
    name: 'hotel'
  })
  useEffect(() => {
    if (!Array.isArray(hotels)) {
      return
    }
    const hotelsSumma = hotels.reduce((acc, hotel) => acc + (hotel.hostel_summa ?? 0), 0)
    const childIndex = form.getValues('childs').findIndex((child) => child.type === 'hostel')
    if (childIndex !== -1 && hotelsSumma !== form.getValues(`childs.${childIndex}.summa`)) {
      form.setValue(`childs.${childIndex}.summa`, hotelsSumma)
    }
    if (hotelsSumma !== form.getValues('hostel_summa')) {
      form.setValue('hostel_summa', hotelsSumma)
    }
  }, [hotels])

  console.log({ hotels })
  console.log({ errors: form.formState.errors })
  console.log({ values: form.watch() })

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isFetchingMinimumWage}>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="divide-y">
              <div className="flex items-end flex-wrap">
                <DocumentFields
                  autoGenerate={id === 'create'}
                  documentType={DocumentType.WORK_TRIP}
                  tabIndex={1}
                  form={form}
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

                <FormElement
                  label={t('pages.bhm')}
                  className="mb-7 mx-5"
                >
                  <Input
                    readOnly
                    value={formatNumber(minimumWageSumma)}
                  />
                </FormElement>
              </div>
              <div className="grid grid-cols-2 divide-x">
                <Fieldset name={t('pages.work_trip')}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
                    <FormField
                      control={form.control}
                      name="from_date"
                      render={({ field }) => (
                        <FormElement
                          label={t('from_date')}
                          direction="column"
                        >
                          <JollyDatePicker
                            value={field.value}
                            onChange={field.onChange}
                            containerProps={{ className: 'w-56' }}
                          />
                        </FormElement>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="to_date"
                      render={({ field }) => (
                        <FormElement
                          label={t('to_date')}
                          direction="column"
                        >
                          <JollyDatePicker
                            value={field.value}
                            onChange={field.onChange}
                            containerProps={{ className: 'w-56' }}
                          />
                        </FormElement>
                      )}
                    />
                  </div>
                </Fieldset>
                <PodotchetFields
                  form={form}
                  spravochnik={podotchetSpravochnik}
                />
              </div>
              <div className="grid grid-cols-12 divide-x">
                <Fieldset
                  name={t('daily_expense')}
                  className="col-span-12 gap-2 md:col-span-6 2xl:col-span-2"
                >
                  <FormField
                    control={form.control}
                    name="day_summa"
                    render={({ field }) => (
                      <FormElement
                        label={t('summa')}
                        direction="row"
                        divProps={{
                          className: 'items-start'
                        }}
                      >
                        <div>
                          <NumericInput
                            readOnly
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue)
                            }}
                          />
                          <div className="text-xs font-semibold text-slate-500 mt-2 flex flex-col justify-between items-end gap-1">
                            <p>
                              [{t('pages.bhm').toLowerCase()}] * 0.1 * [{t('days').toLowerCase()}]
                            </p>
                            <p>
                              {formatNumber(minimumWageSumma)} * 0.1 * {daysCount}
                            </p>
                          </div>
                        </div>
                      </FormElement>
                    )}
                  />
                  <FormElement
                    label={t('days')}
                    direction="column"
                  >
                    <Input
                      readOnly
                      value={daysCount}
                    />
                  </FormElement>
                </Fieldset>
                <Fieldset
                  name={t('road_expense')}
                  className="col-span-12 md:order-1 2xl:order-none md:col-span-12 2xl:col-span-6"
                >
                  <WorkTripRoads
                    form={form}
                    minimumWageSumma={minimumWageSumma}
                  />
                </Fieldset>
                <Fieldset
                  name={t('hotel_expense')}
                  className="col-span-12 md:col-span-6 2xl:col-span-4"
                >
                  <WorkTripHotels form={form} />
                </Fieldset>
              </div>
              <div className="grid grid-cols-2 divide-x">
                <Fieldset name={t('opisanie')}>
                  <FormField
                    name="comment"
                    control={form.control}
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('opisanie')}
                      >
                        <Textarea
                          rows={4}
                          spellCheck={false}
                          {...field}
                        />
                      </FormElement>
                    )}
                  />
                </Fieldset>
                <SummaFields
                  tabIndex={3}
                  data={{ summa: form.watch('summa') }}
                />
              </div>
              <div className="p-5 pb-28">
                <EditableTable
                  name="childs"
                  columnDefs={WorkTripProvodkaColumns as any}
                  errors={form.formState.errors.childs as any}
                  form={form}
                />
              </div>
            </div>

            <DetailsView.Footer>
              <DetailsView.Create
                type="submit"
                isPending={isCreatingWorkTrip || isUpdatingWorkTrip}
              />
            </DetailsView.Footer>
          </form>
        </Form>
      </DetailsView.Content>
    </DetailsView>
  )
}
