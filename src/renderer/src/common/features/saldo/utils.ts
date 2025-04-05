import type { MonthValue, SaldoNamespace } from './interfaces'

import { HttpResponseError } from '@/common/lib/http'

import { useSaldoControllerStore } from './store'

export const compareMonthValues = (a: MonthValue, b: MonthValue) => {
  return a.year - b.year || a.month - b.month
}

export const handleSaldoErrorDates = (ns: SaldoNamespace, error: unknown) => {
  if (error instanceof HttpResponseError) {
    const { dates } = (error.meta as { dates: MonthValue[] }) ?? {}
    if (Array.isArray(dates)) {
      useSaldoControllerStore.getState().enqueueMonth(ns, ...dates)
    }
  }
}

export const handleSaldoResponseDates = (ns: SaldoNamespace, res: unknown) => {
  if (typeof res === 'object' && res !== null && 'meta' in res && typeof res.meta === 'object') {
    const { dates } = (res.meta as { dates: MonthValue[] }) ?? {}
    if (Array.isArray(dates)) {
      useSaldoControllerStore.getState().enqueueMonth(ns, ...dates)
    }
  }
}
