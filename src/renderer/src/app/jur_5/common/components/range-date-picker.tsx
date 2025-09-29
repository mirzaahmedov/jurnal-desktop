import { useEffect, useState } from 'react'

import { ChevronLeft, ChevronRight, CircleArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'

export interface RangeDatePickerProps {
  from: string
  to: string
  onValueChange?: (from: string, to: string) => void
}
export const RangeDatePicker = ({ from, to, onValueChange }: RangeDatePickerProps) => {
  const { t } = useTranslation()

  const [startDate, setStartDate] = useState(from)
  const [endDate, setEndDate] = useState(to)

  const handleNextDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(field === 'from' ? startDate! : endDate!)
    date.setDate(date.getDate() + amount)
    const newDate = date.toISOString().split('T')[0]
    if (field === 'from') setStartDate(newDate)
    else setEndDate(newDate)
  }
  const handlePrevDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(field === 'from' ? startDate! : endDate!)
    date.setDate(date.getDate() - amount)
    const newDate = date.toISOString().split('T')[0]
    if (field === 'from') setStartDate(newDate)
    else setEndDate(newDate)
  }

  useEffect(() => {
    setStartDate(from)
    setEndDate(to)
  }, [from, to])

  return (
    <div className="flex items-center flex-wrap gap-x-1 gap-y-2.5">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onPress={() => handlePrevDay('from', 1)}
      >
        <ChevronLeft className="btn-icon" />
      </Button>
      <JollyDatePicker
        autoFocus
        value={startDate}
        onChange={(date) => setStartDate(date)}
        containerProps={{ className: 'w-36 min-w-36' }}
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
      <JollyDatePicker
        value={endDate}
        onChange={(date) => setEndDate(date)}
        containerProps={{ className: 'w-36 min-w-36' }}
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
        <Button
          type="button"
          onPress={() => {
            onValueChange?.(startDate, endDate)
          }}
        >
          <CircleArrowDown className="btn-icon icon-start" />
          {t('load')}
        </Button>
      </div>
    </div>
  )
}
