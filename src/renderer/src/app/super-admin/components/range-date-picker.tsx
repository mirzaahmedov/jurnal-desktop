import { formatDate, getFirstDayOfMonth, parseDate } from '@/common/lib/date'
import { useEffect, useState } from 'react'

import { Button } from '@/common/components/jolly/button'
import { CircleArrowDown } from 'lucide-react'
import { DatePicker } from '@/common/components'
import { useTranslation } from 'react-i18next'

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
      <DatePicker
        readOnly
        value={formatDate(getFirstDayOfMonth(parseDate(innerValue)))}
      />
      -
      <DatePicker
        value={innerValue}
        onChange={setInnerValue}
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
