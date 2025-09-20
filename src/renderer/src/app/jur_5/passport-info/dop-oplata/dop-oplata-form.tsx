import type { MainZarplata } from '@/common/models'
import type { DopOplata } from '@/common/models/dop-oplata'
import type { Payment } from '@/common/models/payments'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { PaymentColumnDefs } from '@/app/jur_5/payment-types/payments/columns'
import { PaymentsService } from '@/app/jur_5/payment-types/payments/service'
import { GenericTable, LoadingOverlay, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { FormElementUncontrolled } from '@/common/components/form/form-element-uncontrolled'
import { Debouncer } from '@/common/components/hoc/debouncer'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { Pagination } from '@/common/components/pagination'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { formatDate, parseLocaleDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { DopOplataFormSchema, defaultValues } from './config'
import { DopOplataService } from './service'

export interface DopOplataFormProps {
  mainZarplata: MainZarplata
  selected: DopOplata | undefined
  onFinish: VoidFunction
}
export const DopOplataForm = ({ mainZarplata, selected, onFinish }: DopOplataFormProps) => {
  const { t } = useTranslation(['app'])

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [paymentData, setPaymentData] = useState<Payment | null>(null)

  const form = useForm({
    defaultValues,
    resolver: zodResolver(DopOplataFormSchema)
  })

  const paymentsQuery = useQuery({
    queryKey: [
      PaymentsService.QueryKeys.GetAll,
      {
        page,
        limit,
        code,
        name
      }
    ],
    queryFn: PaymentsService.getAll,
    enabled: !selected
  })

  const dopOplataGetByIdQuery = useQuery({
    queryKey: [DopOplataService.QueryKeys.GetById, selected?.id ?? 0],
    queryFn: DopOplataService.getById,
    enabled: !!selected
  })
  const dopOplataData = dopOplataGetByIdQuery.data

  const dopOplataCreateMutation = useMutation({
    mutationFn: DopOplataService.create,
    onSuccess: () => {
      form.reset(defaultValues)
      onFinish?.()
    },
    onError: (error) => {
      console.log(error)
      toast.error(t('create_failed'))
    }
  })

  const dopOplataUpdateMutation = useMutation({
    mutationFn: DopOplataService.update,
    onSuccess: () => {
      form.reset(defaultValues)
      onFinish?.()
    },
    onError: (error) => {
      console.log(error)
      toast.error(t('update_failed'))
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (selected) {
      dopOplataUpdateMutation.mutate({
        id: selected.id,
        values: {
          ...values,
          from: formatLocaleDate(values.from),
          to: formatLocaleDate(values.to),
          mainZarplataId: mainZarplata?.id
        }
      })
      return
    }
    dopOplataCreateMutation.mutate({
      ...values,
      from: formatLocaleDate(values.from),
      to: formatLocaleDate(values.to),
      mainZarplataId: mainZarplata?.id
    })
  })

  const isVacationPayment = paymentData?.code === 32
  const isCreate = !selected

  useEffect(() => {
    if (dopOplataData) {
      form.reset({
        ...dopOplataData,
        from: formatDate(parseLocaleDate(dopOplataData.from)),
        to: formatDate(parseLocaleDate(dopOplataData.to))
      })
    } else {
      form.reset({
        ...defaultValues
      })
    }
  }, [form, dopOplataData])

  useEffect(() => {
    if (isVacationPayment) {
      form.setValue('percentage', 0)
    }
  }, [form, isVacationPayment])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="h-full flex flex-col overflow-hidden divide-y"
        >
          <div className="flex-1 min-h-0 p-5 flex flex-col divide-y">
            <div className="flex items-center flex-wrap divide-x border-t">
              <div className="flex flex-shrink max-w-[40%] items-center flex-wrap gap-5 p-5 pl-0">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormElement
                      label={t('start_date')}
                      direction="column"
                      hideDescription
                    >
                      <JollyDatePicker
                        {...field}
                        readOnly={!isCreate}
                        className="w-full"
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormElement
                      label={t('end_date')}
                      direction="column"
                      hideDescription
                    >
                      <JollyDatePicker
                        {...field}
                        readOnly={!isCreate}
                        className="w-full"
                      />
                    </FormElement>
                  )}
                />
              </div>

              <div className="h-full flex-1 min-w-0 flex items-center flex-wrap gap-5 px-5 py-2.5 bg-gray-50">
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormElement
                      label={t('days')}
                      hideDescription
                    >
                      <NumericInput
                        readOnly={!isCreate}
                        disabled={field.disabled}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? 0)
                        }}
                        decimalScale={undefined}
                        className="w-24"
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summa"
                  render={({ field }) => (
                    <FormElement
                      label={t('summa')}
                      className="w-full max-w-64"
                      hideDescription
                    >
                      <NumericInput
                        readOnly={!isCreate}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                      />
                    </FormElement>
                  )}
                />

                {!isCreate ? (
                  <FormElementUncontrolled
                    label={t('payment')}
                    divProps={{ className: 'flex-1' }}
                  >
                    <Textarea
                      readOnly
                      value={dopOplataData?.paymentName ?? ''}
                    />
                  </FormElementUncontrolled>
                ) : null}
              </div>
            </div>

            {isCreate ? (
              <div className="flex items-center justify-start gap-2.5 py-5">
                <Debouncer
                  value={name}
                  onChange={setName}
                >
                  {({ value, onChange }) => (
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={t('name')}
                      className="w-64"
                    />
                  )}
                </Debouncer>
                <Debouncer
                  value={code}
                  onChange={setCode}
                >
                  {({ value, onChange }) => (
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={t('code')}
                      className="w-64"
                    />
                  )}
                </Debouncer>
              </div>
            ) : null}

            {isCreate ? (
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar">
                {paymentsQuery.isFetching ? <LoadingOverlay /> : null}
                <GenericTable
                  columnDefs={PaymentColumnDefs({ isEditable: false })}
                  data={paymentsQuery?.data?.data ?? []}
                  selectedIds={form.watch('paymentId') ? [form.watch('paymentId')] : []}
                  onClickRow={(item) => {
                    setPaymentData(item)
                    form.setValue('paymentId', item.id)
                  }}
                  className="table-generic-xs"
                />
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar">
                {dopOplataGetByIdQuery.isFetching ? <LoadingOverlay /> : null}
                <GenericTable
                  columnDefs={[
                    {
                      key: 'deductionName',
                      header: t('name')
                    },
                    {
                      key: 'percentage',
                      header: t('percentage')
                    },
                    {
                      key: 'summa',
                      header: t('summa'),
                      renderCell: (row) => <SummaCell summa={row.summa} />
                    }
                  ]}
                  data={dopOplataData?.additionalDeductions ?? []}
                  className="table-generic-xs border border-t border-l"
                />
              </div>
            )}
          </div>

          {isCreate ? (
            <div className="p-5 pb-0 flex items-center justify-between gap-5">
              <Pagination
                page={page}
                limit={limit}
                count={paymentsQuery?.data?.meta?.count ?? 0}
                pageCount={paymentsQuery?.data?.meta?.pageCount ?? 0}
                onChange={(values) => {
                  if (values.page) {
                    setPage(values.page)
                  }
                  if (values.limit) {
                    setLimit(values.limit)
                  }
                }}
              />
              <Button
                type="submit"
                isDisabled={!form.watch('paymentId')}
              >
                {t('continue')}
              </Button>
            </div>
          ) : null}
        </form>
      </Form>
    </>
  )
}
