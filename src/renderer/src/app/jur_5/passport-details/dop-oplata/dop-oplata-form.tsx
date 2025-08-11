import type { MainZarplata } from '@/common/models'
import type { DopOplata } from '@/common/models/dop-oplata'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
    }
  })

  const dopOplataUpdateMutation = useMutation({
    mutationFn: DopOplataService.update,
    onSuccess: () => {
      form.reset(defaultValues)
      onFinish?.()
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

  useEffect(() => {
    if (selected) {
      form.reset({
        ...selected,
        from: formatDate(parseLocaleDate(selected.from)),
        to: formatDate(parseLocaleDate(selected.to))
      })
    } else {
      form.reset({
        ...defaultValues
      })
    }
  }, [form, selected])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col overflow-hidden divide-y"
      >
        <div className="flex-1 min-h-0 p-5 flex flex-col gap-5">
          <div className="flex items-center flex-wrap gap-5">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormElement label={t('start_date')}>
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
                <FormElement label={t('end_date')}>
                  <JollyDatePicker
                    {...field}
                    className="w-full"
                  />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormElement
                  label={t('foiz') + '(%)'}
                  className="w-full max-w-64"
                >
                  <NumericInput
                    disabled={field.disabled}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value}
                    onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                    allowNegative={false}
                    decimalScale={undefined}
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
                >
                  <NumericInput
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

          <div className="flex items-center justify-start gap-2.5">
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
                form.setValue('paymentId', item.id)
              }}
              className="table-generic-xs"
            />
          </div>
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
        </div>

        <div className="px-5 pt-5">
          <Button type="submit">{t('save')}</Button>
        </div>
      </form>
    </Form>
  )
}
