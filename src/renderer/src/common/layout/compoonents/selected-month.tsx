import { useLocation } from 'react-router-dom'

import { MonthPicker } from '@/common/components/month-picker'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useLocationStore } from '@/common/hooks'
import { formatDate, parseDate } from '@/common/lib/date'

export const SelectedMonth = () => {
  const location = useLocation()

  const { startDate, setSelectedMonth } = useSelectedMonthStore()
  const { values, setValues } = useLocationStore()

  return (
    <MonthPicker
      value={formatDate(startDate)}
      onChange={(value) => {
        setSelectedMonth(parseDate(value))

        if (location.pathname.includes('journal-7'))
          Object.keys(values).forEach((pathname) => {
            if (pathname.includes('journal-7')) {
              setValues(pathname, {})
            }
          })
        else if (location.pathname.includes('kassa'))
          Object.keys(values).forEach((pathname) => {
            if (pathname.includes('kassa')) {
              setValues(pathname, {})
            }
          })
        else if (location.pathname.includes('bank'))
          Object.keys(values).forEach((pathname) => {
            if (pathname.includes('bank')) {
              setValues(pathname, {})
            }
          })
      }}
    />
  )
}
