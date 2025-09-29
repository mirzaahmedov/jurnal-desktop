import type { DayPickerSingleProps } from 'react-day-picker'

import { useEffect } from 'react'

import { ChevronLeft, ChevronRight, CircleArrowDown } from 'lucide-react'
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

  const handleNextDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(form.getValues(field))
    date.setDate(date.getDate() + amount)
    const newDate = date.toISOString().split('T')[0]
    if (!validateDate || validateDate(newDate)) {
      form.setValue(field, newDate)
      return
    }
  }
  const handlePrevDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(form.getValues(field))
    date.setDate(date.getDate() - amount)
    const newDate = date.toISOString().split('T')[0]
    if (!validateDate || validateDate(newDate)) {
      form.setValue(field, newDate)
      return
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex items-center flex-wrap gap-x-1 gap-y-2.5"
        onSubmit={onSubmit}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          onPress={() => handlePrevDay('from', 1)}
        >
          <ChevronLeft className="btn-icon" />
        </Button>
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <JollyDatePicker
              autoFocus
              validate={validateDate}
              calendarProps={calendarProps}
              containerProps={{ className: 'w-36 min-w-36' }}
              {...field}
            />
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onPress={() => handleNextDay('from', 1)}
        >
          <ChevronRight className="btn-icon" />
        </Button>
        <b className="mx-0.5">-</b>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onPress={() => handlePrevDay('to', 1)}
        >
          <ChevronLeft className="btn-icon" />
        </Button>
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <JollyDatePicker
              validate={validateDate}
              calendarProps={calendarProps}
              containerProps={{ className: 'w-36 min-w-36' }}
              {...field}
            />
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onPress={() => handleNextDay('to', 1)}
        >
          <ChevronRight className="btn-icon" />
        </Button>
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
