import type { DayPickerSingleProps } from 'react-day-picker'

import { useEffect } from 'react'

import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { usePagination } from '@/common/hooks/use-pagination'

import { JollyDatePicker } from './jolly-date-picker'
import { Button } from './jolly/button'
import { Form, FormField } from './ui/form'

interface RangeDateValues {
  from: string
  to: string
}
export interface RangeDatePickerProps extends RangeDateValues {
  onChange: (values: Partial<RangeDateValues>) => void
  validateDate?: (date: string) => boolean
  calendarProps?: Omit<DayPickerSingleProps, 'mode'>
}
export const RangeDatePicker = ({
  from,
  to,
  onChange,
  validateDate,
  calendarProps
}: RangeDatePickerProps) => {
  const { t } = useTranslation()

  const pagination = usePagination()

  const form = useForm({
    defaultValues: {
      from,
      to
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    onChange(values)
    pagination.onChange({
      page: 1
    })
  })

  useEffect(() => {
    form.reset({
      from,
      to
    })
  }, [form, from, to])

  return (
    <Form {...form}>
      <form
        className="flex items-center flex-wrap gap-5 gap-y-2.5"
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <JollyDatePicker
              autoFocus
              validate={validateDate}
              calendarProps={calendarProps}
              {...field}
            />
          )}
        />
        -
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <JollyDatePicker
              validate={validateDate}
              calendarProps={calendarProps}
              {...field}
            />
          )}
        />
        <div className="space-x-1">
          <Button type="submit">
            <CircleArrowDown className="btn-icon icon-start" />
            {t('load')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
