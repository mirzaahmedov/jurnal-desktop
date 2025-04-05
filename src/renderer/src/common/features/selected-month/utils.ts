import { t } from 'i18next'
import { toast } from 'react-toastify'

import { useSelectedMonthStore } from '@/common/features/selected-month'
import { ISODateRegex, formatDate, parseDate, validateDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

export const validateDateWithinSelectedMonth = (date: string) => {
  const { startDate, endDate } = useSelectedMonthStore.getState()
  if (!validateDate(date)) {
    if (ISODateRegex.test(date)) {
      toast.error(t('date_does_not_exist'))
    }
    return false
  }
  const ok = startDate <= parseDate(date) && parseDate(date) <= endDate
  if (!ok && date?.length === 10) {
    toast.error(
      t('out_of_range', {
        minDate: formatLocaleDate(formatDate(startDate)),
        maxDate: formatLocaleDate(formatDate(endDate))
      })
    )
  }
  return ok
}
