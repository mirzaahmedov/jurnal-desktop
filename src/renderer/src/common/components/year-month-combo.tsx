import type { FC } from 'react'

import { ChevronsLeft, ChevronsRight } from 'lucide-react'

import { formatDate, parseDate } from '@/common/lib/date'

import { Button } from './jolly/button'
import { MonthPicker } from './month-picker'

export interface YearMonthComboProps {
  year: number | undefined
  month: number | undefined
  onYearChange: (year: number | undefined) => void
  onMonthChange: (month: number | undefined) => void
}

export const YearMonthCombo: FC<YearMonthComboProps> = ({
  year,
  month,
  onYearChange,
  onMonthChange
}) => {
  const date = year && month ? new Date(year, month - 1) : null
  const dateString = year && month ? formatDate(new Date(year, month - 1)) : ''

  const handleMonthChange = (value: string) => {
    const date = parseDate(value)
    if (date) {
      onYearChange(date.getFullYear())
      onMonthChange(date.getMonth() + 1)
    } else {
      onYearChange(undefined)
      onMonthChange(undefined)
    }
  }

  const handlePrevMonth = () => {
    if (date) {
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1)
      onYearChange(prevMonth.getFullYear())
      onMonthChange(prevMonth.getMonth() + 1)
    }
  }

  const handleNextMonth = () => {
    if (date) {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1)
      onYearChange(nextMonth.getFullYear())
      onMonthChange(nextMonth.getMonth() + 1)
    }
  }

  return (
    <div className="flex gap-0.5">
      <Button
        size="icon"
        variant="outline"
        onPress={handlePrevMonth}
      >
        <ChevronsLeft className="btn-icon" />
      </Button>
      <MonthPicker
        value={dateString}
        onChange={handleMonthChange}
      />
      <Button
        size="icon"
        variant="outline"
        onPress={handleNextMonth}
      >
        <ChevronsRight className="btn-icon" />
      </Button>
    </div>
  )
}
