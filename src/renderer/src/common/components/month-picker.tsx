import type { PopoverProps } from 'react-aria-components'

import { useState } from 'react'

import { add, eachMonthOfInterval, endOfYear, format, parse } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { uz } from 'date-fns/locale/uz'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, type ButtonProps } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { formatDate, parseDate } from '@/common/lib/date'
import { cn } from '@/common/lib/utils'

import { useToggle } from '../hooks'

export interface MonthCalendarProps {
  month: Date
  onMonthChange: (newMonth: Date) => void
}

export const MonthCalendar = ({ month, onMonthChange }: MonthCalendarProps) => {
  const [currentYear, setCurrentYear] = useState(format(month, 'yyyy'))

  const { i18n } = useTranslation()

  const firstDayCurrentYear = parse(currentYear, 'yyyy', new Date())

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear)
  })

  const handlePrevYear = () => {
    const firstDayNextYear = add(firstDayCurrentYear, { years: -1 })
    setCurrentYear(format(firstDayNextYear, 'yyyy'))
  }

  const handleNextYear = () => {
    const firstDayNextYear = add(firstDayCurrentYear, { years: 1 })
    setCurrentYear(format(firstDayNextYear, 'yyyy'))
  }

  return (
    <div className="p-3">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="space-y-4">
          <div className="relative flex items-center justify-center pt-1">
            <div
              className="text-sm font-medium"
              aria-live="polite"
              role="presentation"
              id="month-picker"
            >
              {format(firstDayCurrentYear, 'yyyy')}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                name="previous-year"
                aria-label="Go to previous year"
                className={cn(
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  'absolute left-1'
                )}
                type="button"
                onPress={handlePrevYear}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                name="next-year"
                aria-label="Go to next year"
                className={cn(
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  'absolute right-1 disabled:bg-slate-100'
                )}
                type="button"
                onPress={handleNextYear}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div
            className="grid w-full grid-cols-3 gap-2"
            role="grid"
            aria-labelledby="month-picker"
          >
            {months.map((current) => (
              <div
                key={current.toString()}
                className="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800"
                role="presentation"
              >
                <Button
                  excludeFromTabOrder
                  name="day"
                  variant={
                    current.getMonth() === month.getMonth() &&
                    current.getFullYear() === month.getFullYear()
                      ? 'default'
                      : 'ghost'
                  }
                  type="button"
                  onPress={() => onMonthChange(current)}
                >
                  <time dateTime={format(current, 'yyyy-MM-dd')}>
                    {format(current, 'MMM', {
                      locale: i18n.language === 'ru' ? ru : uz
                    })}
                  </time>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export interface MonthPickerProps extends Omit<ButtonProps, 'onChange'> {
  readOnly?: boolean
  value: string
  onChange: (value: string) => void
  popoverProps?: PopoverProps
}
export const MonthPicker = ({
  readOnly = false,
  value,
  onChange,
  className,
  popoverProps,
  ...props
}: MonthPickerProps) => {
  const popperToggle = useToggle()

  const { i18n } = useTranslation()

  const date = value ? parseDate(value) : new Date()
  const setDate = (newDate: Date) => {
    onChange(formatDate(newDate))
    popperToggle.close()
  }

  return (
    <PopoverTrigger
      isOpen={popperToggle.isOpen}
      onOpenChange={popperToggle.setOpen}
    >
      <Button
        variant="outline"
        className={cn(
          'flex items-center gap-1',
          readOnly && 'disabled:opacity-100 pointer-events-none',
          className
        )}
        {...props}
      >
        <CalendarIcon className="size-4 mx-0" />
        {format(date, 'yyyy MMMM', {
          locale: i18n.language === 'ru' ? ru : uz
        })}
      </Button>
      <Popover {...popoverProps}>
        <PopoverDialog>
          <MonthCalendar
            month={date}
            onMonthChange={setDate}
          />
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}
