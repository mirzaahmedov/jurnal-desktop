import { date_iso_regex, formatDate, parseDate, validateDate } from '@renderer/common/lib/date'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { HttpResponseError } from '@renderer/common/lib/http'
import { t } from 'i18next'
import { toast } from 'react-toastify'

import { type MonthValue, useOstatokStore } from './store'

export const validateOstatokDate = (date: string) => {
  const { minDate, maxDate } = useOstatokStore.getState()
  if (!validateDate(date)) {
    if (date_iso_regex.test(date)) {
      toast.error(t('date_does_not_exist'))
    }
    return false
  }
  const isValid = minDate <= parseDate(date) && parseDate(date) <= maxDate
  if (!isValid && date?.length === 10) {
    toast.error(
      t('out_of_range', {
        minDate: formatLocaleDate(formatDate(minDate)),
        maxDate: formatLocaleDate(formatDate(maxDate))
      })
    )
  }
  return isValid
}

export const handleOstatokResponse = (res: unknown) => {
  if (typeof res === 'object' && res !== null && 'meta' in res && Array.isArray(res.meta)) {
    const meta = ((res?.meta as MonthValue[]) ?? []).map((e) => ({ year: e.year, month: e.month }))
    useOstatokStore.getState().enqueueMonth(...meta)
  }
}

export const handleOstatokError = (error: Error | null) => {
  if (error instanceof HttpResponseError && error.meta && Array.isArray(error.meta)) {
    const meta = error.meta as MonthValue[]
    useOstatokStore.getState().enqueueMonth(...meta)
  }
}
