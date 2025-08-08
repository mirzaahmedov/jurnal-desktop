import { useEffect, useState } from 'react'

import { CircleArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { ISO_DATE_REGEX, formatDate, getFirstDayOfMonth, parseDate } from '@/common/lib/date'

export const validateDate = (dateString: string): boolean => {
  if (!dateString || !ISO_DATE_REGEX.test(dateString)) {
    return false
  }

  const date = new Date(dateString)

  const [year, month, day] = dateString.split('-').map(Number)

  return (
    !isNaN(date.getTime()) &&
    date.getDate() === day &&
    date.getMonth() + 1 === month &&
    date.getFullYear() === year &&
    date.getFullYear() < 2025
  )
}

export interface EndDatePickerProps {
  value: string
  onChange: (value: string) => void
  refetch: VoidFunction
}
export const EndDatePicker = ({ value, onChange, refetch }: EndDatePickerProps) => {
  const [innerValue, setInnerValue] = useState(value)

  const { t } = useTranslation()

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  return (
    <div className="flex items-center gap-5">
      <JollyDatePicker
        readOnly
        value={formatDate(getFirstDayOfMonth(parseDate(innerValue)))}
        calendarProps={{
          fromYear: 2025
        }}
      />
      -
      <JollyDatePicker
        value={innerValue}
        onChange={setInnerValue}
        calendarProps={{
          fromYear: 2025
        }}
      />
      <Button
        type="submit"
        onPress={() => {
          onChange(innerValue)
          refetch()
        }}
      >
        <CircleArrowDown className="btn-icon icon-start" />
        {t('load')}
      </Button>
    </div>
  )
}
