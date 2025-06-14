import { DatePicker, Fieldset, NumericInput, Spinner } from '@/common/components'
import { DocumentFields, PodotchetFields, SummaFields } from '@/common/widget/form'
import { Form, FormField } from '@/common/components/ui/form'
import { OperatsiiService, operatsiiQueryKeys } from '@/app/super-admin/operatsii'
import { WorkTripFormSchema, WorkTripQueryKeys, defaultValues } from '../config'
import { formatDate, getWeekdaysBetween, parseDate, withinMonth } from '@/common/lib/date'
import { useForm, useWatch } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'

import { Button } from '@/common/components/jolly/button'
import { Calculator } from 'lucide-react'
import { DetailsView } from '@/common/views'
import { DistanceQueryKeys } from '@/app/super-admin/spravochnik/distance/config'
import { DistanceService } from '@/app/super-admin/spravochnik/distance/service'
import { DistrictsModal } from './districts-modal'
import { EditableTable } from '@/common/components/editable-table'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'
import { MinimumWageService } from '@/app/super-admin/spravochnik/minimum-wage/service'
import { Textarea } from '@/common/components/ui/textarea'
import { TypeSchetOperatsii } from '@/common/models'
import { WorkTripProvodkaColumns } from './provodki'
import { WorkTripService } from '../service'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useToggle } from '@/common/hooks'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'

export interface WorkTripDetailsProps {
  id: string
}
export const WorkTripDetails = ({ id }: WorkTripDetailsProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const fromToggle = useToggle()
  const toToggle = useToggle()

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
  const { data: distance, isFetching: isFetchingDistance } = useQuery({
    queryKey: [
      DistanceQueryKeys.GetAll,
      {
        from_district_id: form.watch('from_district_id'),
        to_district_id: form.watch('to_district_id'),
        page: 1,
        limit: 1
      }
    ],
    queryFn: DistanceService.getAll,
    enabled:
      !!form.watch('from_district_id') &&
      !!form.watch('to_district_id') &&
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
  const daysCount = getWeekdaysBetween(
    new Date(form.watch('from_date')),
    new Date(form.watch('to_date'))
  )
  useEffect(() => {
    if (!form.getValues('road_ticket_number')) {
      form.setValue('road_summa', distanceKM * (minimumWageSumma * 0.001))
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
    form.setValue('day_summa', minimumWageSumma * 0.1 * daysCount)
  }, [minimumWageSumma, daysCount])

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
                  <p className="text-sm text-gray-500">{t('days', { count: daysCount })}</p>
                </Fieldset>
                <Fieldset
                  name={t('road_expense')}
                  className="col-span-2"
                >
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="from_district_id"
                        render={({ field }) => (
                          <FormElement
                            label={t('from_where')}
                            direction="column"
                          >
                            <Input
                              readOnly
                              ref={field.ref}
                              name={field.name}
                              onBlur={field.onBlur}
                              value={form.watch('from_district_name')}
                              onDoubleClick={fromToggle.open}
                            />
                          </FormElement>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="to_district_id"
                        render={({ field }) => (
                          <FormElement
                            label={t('to_where')}
                            direction="column"
                          >
                            <Input
                              readOnly
                              ref={field.ref}
                              name={field.name}
                              onBlur={field.onBlur}
                              value={form.watch('to_district_name')}
                              onDoubleClick={toToggle.open}
                            />
                          </FormElement>
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t('distance')}: {distanceKM} km
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
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

      <DistrictsModal
        isOpen={fromToggle.isOpen}
        onOpenChange={fromToggle.setOpen}
        onSelect={(district) => {
          form.setValue('from_district_id', district.id, { shouldValidate: true })
          form.setValue('from_district_name', district.name, { shouldValidate: true })
          fromToggle.close()
        }}
      />
      <DistrictsModal
        isOpen={toToggle.isOpen}
        onOpenChange={toToggle.setOpen}
        onSelect={(district) => {
          form.setValue('to_district_id', district.id, { shouldValidate: true })
          form.setValue('to_district_name', district.name, { shouldValidate: true })
          toToggle.close()
        }}
      />
    </DetailsView>
  )
}
