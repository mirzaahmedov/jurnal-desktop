import { useJurnal7DateRange } from '@renderer/app/jurnal-7/common/components/use-date-range'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { usePagination } from '@renderer/common/hooks/use-pagination'
import {
  formatDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  parseDate
} from '@renderer/common/lib/date'
import { useLocation } from 'react-router-dom'

import { useJurnal7DefaultsStore } from './store'

export const ChangeJurnal7Defaults = () => {
  const { from, setDates } = useJurnal7DefaultsStore()
  const { setParams } = useJurnal7DateRange()

  const pagination = usePagination()
  const location = useLocation()

  const handleChange = (dateString: string) => {
    const date = parseDate(dateString)
    const from = formatDate(getFirstDayOfMonth(date))
    const to = formatDate(getLastDayOfMonth(date))

    setDates({
      from,
      to
    })
    if (location.pathname.includes('jurnal-7')) {
      setParams({
        from,
        to
      })
      pagination.onChange({
        page: 1
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <MonthPicker
        value={from}
        onChange={handleChange}
        className="w-56"
      />
    </div>
  )
}
