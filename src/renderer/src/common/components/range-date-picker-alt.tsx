import { useEffect, useMemo, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDate, parseDate } from '@internationalized/date'
import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { usePagination } from '@/common/hooks/use-pagination'
import { getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'

import { Button } from './jolly/button'
import { JollyDateRangePicker } from './jolly/date-picker'
import { Form } from './ui/form'

const RangeDatePickerSchema = z.object({
  from: z.string().nonempty(),
  to: z.string().nonempty()
})

interface RangeDateValues {
  from: string
  to: string
}
export interface RangeDatePickerProps extends RangeDateValues {
  onChange: (values: Partial<RangeDateValues>) => void
  selectedMonth?: Date
}
export const RangeDatePickerAlt = ({ from, to, onChange, selectedMonth }: RangeDatePickerProps) => {
  const valid = useRef(true)
  const pagination = usePagination()

  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      from,
      to
    },
    resolver: zodResolver(RangeDatePickerSchema)
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

  const values = form.watch()

  const value = useMemo(() => {
    if (values.from && values.to) {
      return {
        start: parseDate(values.from),
        end: parseDate(values.to)
      }
    }
    return null
  }, [values])
  const minValue = useMemo(() => {
    if (selectedMonth) {
      const firstDay = getFirstDayOfMonth(selectedMonth)
      return new CalendarDate(firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate())
    }
    return undefined
  }, [selectedMonth])
  const maxValue = useMemo(() => {
    if (selectedMonth) {
      const lastDay = getLastDayOfMonth(selectedMonth)
      return new CalendarDate(lastDay.getFullYear(), lastDay.getMonth() + 1, lastDay.getDate())
    }
    return undefined
  }, [selectedMonth])

  console.log({ values: form.watch(), errors: form.formState.errors })

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-5"
        onSubmit={onSubmit}
      >
        <JollyDateRangePicker
          className="gap-0"
          value={value}
          isInvalid={!form.formState.isValid}
          onChange={(value) => {
            if (value) {
              form.setValue('from', value.start.toString(), { shouldValidate: true })
              form.setValue('to', value.end.toString(), { shouldValidate: true })
            } else {
              form.setValue('from', '', { shouldValidate: true })
              form.setValue('to', '', { shouldValidate: true })
            }
          }}
          validate={(value) => {
            const validDate =
              (!minValue || value.start.compare(minValue) >= 0) &&
              (!maxValue || value.end.compare(maxValue) <= 0)
            if (!validDate) {
              valid.current = false
              return null
            }

            const validRange = value.start.compare(value.end) <= 0
            if (!validRange) {
              valid.current = false
              return null
            }

            valid.current = true
            return true
          }}
          onBlur={() => {
            if (!valid.current) {
              form.setValue('from', '', { shouldValidate: true })
              form.setValue('to', '', { shouldValidate: true })
            }
          }}
          calendarProps={{
            minValue,
            maxValue
          }}
        />
        <Button type="submit">
          <CircleArrowDown className="btn-icon mr-2" />
          {t('load')}
        </Button>
      </form>
    </Form>
  )
}
