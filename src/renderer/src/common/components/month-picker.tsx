import { useState } from 'react'

import { add, eachMonthOfInterval, endOfYear, format, parse } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { uz } from 'date-fns/locale/uz'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, type ButtonProps, buttonVariants } from '@/common/components/ui/button'
import { formatDate, parseDate } from '@/common/lib/date'
import { cn } from '@/common/lib/utils'

import { useToggle } from '../hooks'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type MonthCalendarProps = {
  currentMonth: Date
  onMonthChange: (newMonth: Date) => void
}

const MonthCalendar = ({ currentMonth, onMonthChange }: MonthCalendarProps) => {
  const [currentYear, setCurrentYear] = useState(format(currentMonth, 'yyyy'))

  const { i18n } = useTranslation()

  const firstDayCurrentYear = parse(currentYear, 'yyyy', new Date())

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear)
  })

  const previousYear = () => {
    const firstDayNextYear = add(firstDayCurrentYear, { years: -1 })
    setCurrentYear(format(firstDayNextYear, 'yyyy'))
  }

  const nextYear = () => {
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
              <button
                name="previous-year"
                aria-label="Go to previous year"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  'absolute left-1'
                )}
                type="button"
                onClick={previousYear}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                name="next-year"
                aria-label="Go to next year"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  'absolute right-1 disabled:bg-slate-100'
                )}
                type="button"
                onClick={nextYear}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            className="grid w-full grid-cols-3 gap-2"
            role="grid"
            aria-labelledby="month-picker"
          >
            {months.map((month) => (
              <div
                key={month.toString()}
                className="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800"
                role="presentation"
              >
                <Button
                  name="day"
                  role="gridcell"
                  variant="ghost"
                  tabIndex={-1}
                  type="button"
                  onClick={() => onMonthChange(month)}
                >
                  <time dateTime={format(month, 'yyyy-MM-dd')}>
                    {format(month, 'MMM', {
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

type MonthPickerProps = Omit<ButtonProps, 'onChange'> & {
  value: string
  onChange: (value: string) => void
}
const MonthPicker = ({ value, onChange, className, ...props }: MonthPickerProps) => {
  const popoverToggle = useToggle()

  const { i18n } = useTranslation()

  const date = value ? parseDate(value) : new Date()
  const setDate = (newDate: Date) => {
    onChange(formatDate(newDate))
    popoverToggle.close()
  }

  return (
    <Popover
      open={popoverToggle.isOpen}
      onOpenChange={popoverToggle.setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('flex items-center gap-1', className)}
          {...props}
        >
          <CalendarIcon className="size-4 mx-0" />
          {format(date, 'yyyy MMMM', {
            locale: i18n.language === 'ru' ? ru : uz
          })}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <MonthCalendar
          currentMonth={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  )
}

export { MonthPicker, MonthCalendar }
