import type { MainZarplata } from '@/common/models'
import type { Deduction } from '@/common/models/deduction'
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
import { Debouncer } from '@/common/components/hoc/debouncer'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { Pagination } from '@/common/components/pagination'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useToggle } from '@/common/hooks'
import { formatDate, parseLocaleDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { ChooseMultipleDeductionsDialog } from '../../payment-types/deductions/components/choose-multiple-deductions-dialog'
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
  const [deductionIds, setDeductionsIds] = useState<number[]>([])
  const [paymentData, setPaymentData] = useState<Payment | null>(null)

  const deductionsToggle = useToggle()
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
    queryFn: PaymentsService.getAll
  })

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

  const handleSubmit = form.handleSubmit(() => {
    deductionsToggle.open()
  })

  const handleApplyDeductions = () => {
    const values = form.getValues()
    if (selected) {
      dopOplataUpdateMutation.mutate({
        id: selected.id,
        values: {
          ...values,
          deductionIds,
          from: formatLocaleDate(values.from),
          to: formatLocaleDate(values.to),
          mainZarplataId: mainZarplata?.id
        }
      })
      return
    }
    dopOplataCreateMutation.mutate({
      ...values,
      deductionIds,
      from: formatLocaleDate(values.from),
      to: formatLocaleDate(values.to),
      mainZarplataId: mainZarplata?.id
    })
  }

  const isVacationPayment = paymentData?.code === 32

  const calculateSumma = (day: number, daySumma: number, percentage?: number) => {
    if (isVacationPayment) {
      return daySumma * day
    }
    return (daySumma * day * (percentage ?? 1)) / 100
  }

  const handleSelectDeduction = (deduction: Deduction) => {
    if (deductionIds.includes(deduction.id)) {
      setDeductionsIds((prev) => prev.filter((d) => d !== deduction.id))
      return
    }
    setDeductionsIds((prev) => [...prev, deduction.id])
  }

  useEffect(() => {
    if (selected) {
      const deductionIds = selected.additionalDeductions.map((d) => d.id)
      form.reset({
        ...selected,
        deductionIds,
        from: formatDate(parseLocaleDate(selected.from)),
        to: formatDate(parseLocaleDate(selected.to))
      })
      setDeductionsIds(deductionIds)
    } else {
      form.reset({
        ...defaultValues
      })
    }
  }, [form, selected])

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
                        disabled={field.disabled}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? 0)
                          const daySumma = form.getValues('daySumma')
                          const percentage = form.getValues('percentage')
                          const summa = calculateSumma(values.floatValue ?? 0, daySumma, percentage)
                          form.setValue('summa', summa, { shouldValidate: true })
                        }}
                        allowNegative={false}
                        decimalScale={undefined}
                        className="w-24"
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daySumma"
                  render={({ field }) => (
                    <FormElement
                      label={t('day_summa')}
                      className="w-full max-w-64"
                      hideDescription
                    >
                      <NumericInput
                        disabled={field.disabled}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? 0)
                          const days = form.getValues('day')
                          const percentage = form.getValues('percentage')
                          const summa = calculateSumma(days, values.floatValue ?? 0, percentage)
                          form.setValue('summa', summa, { shouldValidate: true })
                        }}
                        allowNegative={false}
                        decimalScale={undefined}
                      />
                    </FormElement>
                  )}
                />

                {!isVacationPayment ? (
                  <FormField
                    control={form.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormElement
                        label={t('foiz') + '(%)'}
                        hideDescription
                      >
                        <NumericInput
                          disabled={field.disabled}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue ?? 0)
                            const days = form.getValues('day')
                            const daySumma = form.getValues('daySumma')
                            const summa = calculateSumma(days, daySumma, values.floatValue ?? 0)
                            form.setValue('summa', summa, { shouldValidate: true })
                          }}
                          allowNegative={false}
                          decimalScale={undefined}
                          className="w-24"
                        />
                      </FormElement>
                    )}
                  />
                ) : null}

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
                        readOnly
                        disabled={field.disabled}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                      />
                    </FormElement>
                  )}
                />
              </div>
            </div>

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
          </div>

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
        </form>
      </Form>
      <ChooseMultipleDeductionsDialog
        isOpen={deductionsToggle.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeductionsIds([])
          }
          deductionsToggle.setOpen(open)
        }}
        deductionIds={deductionIds}
        onSelect={handleSelectDeduction}
        onSubmit={handleApplyDeductions}
        isSubmitting={dopOplataCreateMutation.isPending || dopOplataUpdateMutation.isPending}
      />
    </>
  )
}
