import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { DatePicker, Fieldset, NumericInput } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import { FormElement } from '@/common/components/form'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { useConstantsStore } from '@/common/features/constants/store'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, parseDate, withinMonth } from '@/common/lib/date'
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

  const { startDate } = useSelectedMonthStore()
  const { t } = useTranslation(['app'])
  const { districts } = useConstantsStore()

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
    }
  })

  const { data: workTrip, isFetching } = useQuery({
    queryKey: [WorkTripQueryKeys.GetById, Number(id)],
    queryFn: WorkTripService.getById,
    enabled: id !== 'create'
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
    form.setValue(
      'summa',
      childs.reduce((acc, child) => acc + (child.summa ?? 0), 0)
    )
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

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="divide-y">
              <div className="grid grid-cols-2">
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
                </Fieldset>
                <Fieldset
                  name={t('road_expense')}
                  className="col-span-2"
                >
                  <div className="flex flex-col gap-5">
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
                            <NumericInput
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
                          </FormElement>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="from_district_id"
                        render={({ field }) => (
                          <FormElement
                            label={t('from_where')}
                            direction="column"
                          >
                            <JollyComboBox
                              defaultItems={districts}
                              selectedKey={field.value}
                              onSelectionChange={(value) => field.onChange(value as number)}
                              menuTrigger="focus"
                            >
                              {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                            </JollyComboBox>
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
                            <JollyComboBox
                              defaultItems={districts}
                              selectedKey={field.value}
                              onSelectionChange={(value) => field.onChange(value as number)}
                              menuTrigger="focus"
                            >
                              {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                            </JollyComboBox>
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
