import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calculator } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { OperatsiiService, operatsiiQueryKeys } from '@/app/super-admin/operatsii'
import { DistanceQueryKeys } from '@/app/super-admin/spravochnik/distance/config'
import { DistanceService } from '@/app/super-admin/spravochnik/distance/service'
import { MinimumWageService } from '@/app/super-admin/spravochnik/minimum-wage/service'
import { DatePicker, Fieldset, NumericInput, Spinner } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { useConstantsStore } from '@/common/features/constants/store'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, getWeekdaysBetween, parseDate, withinMonth } from '@/common/lib/date'
import { TypeSchetOperatsii } from '@/common/models'
import { DetailsView } from '@/common/views'
import { DocumentFields, PodotchetFields, SummaFields } from '@/common/widget/form'

import { WorkTripFormSchema, WorkTripQueryKeys, defaultValues } from '../config'
import { WorkTripService } from '../service'
import { WorkTripProvodkaColumns } from './provodki'

export interface WorkTripDetailsProps {
  id: string
}
export const WorkTripDetails = ({ id }: WorkTripDetailsProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { startDate } = useSelectedMonthStore()
  const { regions } = useConstantsStore()

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
  const { data: distance, isFetching: isFetchingDistance } = useQuery({
    queryKey: [
      DistanceQueryKeys.GetAll,
      {
        from_region_id: form.watch('from_region_id'),
        to_region_id: form.watch('to_region_id'),
        page: 1,
        limit: 1
      }
    ],
    queryFn: DistanceService.getAll,
    enabled:
      !!form.watch('from_region_id') &&
      !!form.watch('to_region_id') &&
      !form.watch('road_ticket_number')
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

  const distanceKM = distance?.data?.[0]?.distance_km ?? 0
  const minimumWageSumma = minimumWage?.data?.summa ?? 0
  const workDaysCount = getWeekdaysBetween({
    startDate: new Date(form.watch('from_date')),
    endDate: new Date(form.watch('to_date'))
  })
  const allDaysCount = getWeekdaysBetween({
    startDate: new Date(form.watch('from_date')),
    endDate: new Date(form.watch('to_date')),
    includeWeekends: true
  })
  useEffect(() => {
    if (!form.getValues('road_ticket_number')) {
      form.setValue('road_summa', distanceKM * (minimumWageSumma * 0.01))
    }
  }, [form, distanceKM, minimumWage])
  useEffect(() => {
    if (Array.isArray(distance?.data) && distance?.data?.length === 0) {
      toast.error(t('errors.no_distance'))
    }
  }, [distance?.data])
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
    form.setValue('day_summa', minimumWageSumma * 0.1 * workDaysCount)
  }, [minimumWageSumma, workDaysCount])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isFetchingMinimumWage}>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="divide-y">
              <div>
                <DocumentFields
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
              </div>
              <div className="grid grid-cols-2 divide-x">
                <Fieldset name={t('pages.work_trip')}>
                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="from_date"
                      render={({ field }) => (
                        <FormElement
                          label={t('from_date')}
                          direction="column"
                        >
                          <DatePicker
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
                          <DatePicker
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
              <div className="grid grid-cols-4 divide-x">
                <Fieldset name={t('daily_expense')}>
                  <FormField
                    control={form.control}
                    name="day_summa"
                    render={({ field }) => (
                      <FormElement
                        label={t('summa')}
                        direction="row"
                        description={`[${t('pages.minimum-wage').toLowerCase()}] * 0.1 * [${t('workdays').toLowerCase()}]`}
                      >
                        <NumericInput
                          readOnly
                          value={field.value}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue)
                            form.setValue(
                              'childs',
                              form.getValues('childs').map((child) =>
                                child.type === 'day'
                                  ? {
                                      ...child,
                                      summa: values.floatValue ?? 0
                                    }
                                  : child
                              )
                            )
                          }}
                        />
                      </FormElement>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-5">
                    <FormElement
                      label={t('days')}
                      direction="column"
                    >
                      <Input
                        readOnly
                        value={allDaysCount}
                      />
                    </FormElement>
                    <FormElement
                      label={t('workdays')}
                      direction="column"
                    >
                      <Input
                        readOnly
                        value={workDaysCount}
                      />
                    </FormElement>
                  </div>
                </Fieldset>
                <Fieldset
                  name={t('road_expense')}
                  className="col-span-2"
                >
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="from_region_id"
                        render={({ field, fieldState }) => (
                          <FormElement
                            label={t('from_where')}
                            direction="column"
                          >
                            <JollyComboBox
                              defaultItems={regions}
                              selectedKey={field.value}
                              onSelectionChange={field.onChange}
                              menuTrigger="focus"
                              placeholder={t('region')}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                            >
                              {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                            </JollyComboBox>
                          </FormElement>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="to_region_id"
                        render={({ field, fieldState }) => (
                          <FormElement
                            label={t('to_where')}
                            direction="column"
                          >
                            <JollyComboBox
                              defaultItems={regions}
                              selectedKey={field.value}
                              onSelectionChange={field.onChange}
                              menuTrigger="focus"
                              placeholder={t('region')}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                            >
                              {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                            </JollyComboBox>
                          </FormElement>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <FormElement
                        label={t('distance')}
                        direction="column"
                        divProps={{
                          className: 'gap-3'
                        }}
                      >
                        <Input
                          readOnly
                          value={distanceKM}
                        />
                      </FormElement>
                      <FormField
                        control={form.control}
                        name="road_ticket_number"
                        render={({ field }) => (
                          <FormElement
                            label={t('road_ticket_number')}
                            direction="column"
                            divProps={{
                              className: 'gap-3'
                            }}
                          >
                            <Input {...field} />
                          </FormElement>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="road_summa"
                        render={({ field }) => (
                          <FormElement
                            label={t('summa')}
                            direction="column"
                            divProps={{
                              className: 'gap-3'
                            }}
                            description={
                              form.watch('road_ticket_number')
                                ? ''
                                : `[${t('pages.minimum-wage').toLowerCase()}] * 0.01 * [${t('distance').toLowerCase()}]`
                            }
                          >
                            <div className="flex items-center gap-1">
                              <NumericInput
                                disabled={isFetchingDistance || isFetchingMinimumWage}
                                readOnly={!form.watch('road_ticket_number')}
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.floatValue)
                                  form.setValue(
                                    'childs',
                                    form.getValues('childs').map((child) =>
                                      child.type === 'road'
                                        ? {
                                            ...child,
                                            summa: values.floatValue ?? 0
                                          }
                                        : child
                                    )
                                  )
                                }}
                              />
                              {isFetchingDistance || isFetchingMinimumWage ? (
                                <Spinner />
                              ) : !form.watch('road_ticket_number') ? (
                                <Button
                                  size="icon"
                                  className="shrink-0"
                                >
                                  <Calculator />
                                </Button>
                              ) : null}
                            </div>
                          </FormElement>
                        )}
                      />
                    </div>
                  </div>
                </Fieldset>
                <Fieldset name={t('hotel_expense')}>
                  <FormField
                    control={form.control}
                    name="hostel_ticket_number"
                    render={({ field }) => (
                      <FormElement
                        label={t('hotel_number')}
                        direction="column"
                        className="w-full max-w-sm"
                        divProps={{
                          className: 'gap-3'
                        }}
                      >
                        <Input {...field} />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hostel_summa"
                    render={({ field }) => (
                      <FormElement
                        label={t('summa')}
                        direction="column"
                        className="w-full max-w-sm"
                        divProps={{
                          className: 'gap-3'
                        }}
                      >
                        <NumericInput
                          value={field.value}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue)
                            form.setValue(
                              'childs',
                              form.getValues('childs').map((child) =>
                                child.type === 'hostel'
                                  ? {
                                      ...child,
                                      summa: values.floatValue ?? 0
                                    }
                                  : child
                              )
                            )
                          }}
                        />
                      </FormElement>
                    )}
                  />
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
                  columnDefs={WorkTripProvodkaColumns}
                  errors={form.formState.errors.childs}
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
