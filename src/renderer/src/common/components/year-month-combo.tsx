import type { FC } from 'react'

import { ChevronsLeft, ChevronsRight } from 'lucide-react'

import { formatDate, parseDate } from '@/common/lib/date'

import { Button } from './jolly/button'
import { MonthPicker } from './month-picker'

export interface YearMonthComboProps {
  year: number
  month: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
}

export const YearMonthCombo: FC<YearMonthComboProps> = ({
  year,
  month,
  onYearChange,
  onMonthChange
}) => {
  const date = year && month ? new Date(year, month - 1) : new Date()
  const dateString = year && month ? formatDate(new Date(year, month - 1)) : ''

  const handleMonthChange = (value: string) => {
    const date = value ? parseDate(value) : new Date()

    if (date) {
      onYearChange(date.getFullYear())
      onMonthChange(date.getMonth() + 1)
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
