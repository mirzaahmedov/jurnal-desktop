import type { MonthValue, SaldoNamespace } from './interfaces'

import { useCallback, useMemo } from 'react'

import { useSaldoControllerStore } from './store'

export interface UseSaldoControllerReturn {
  queuedMonths: MonthValue[]
  clearQueue: () => void
  enqueueMonth: (...values: MonthValue[]) => void
  dequeueMonth: (...values: MonthValue[]) => boolean
}
export interface UseSaldoControllerArgs {
  ns: SaldoNamespace
}
export const useSaldoController = ({ ns }: UseSaldoControllerArgs) => {
  const { queuedMonths, clearQueue, enqueueMonth, dequeueMonth } = useSaldoControllerStore()

  return {
    queuedMonths: useMemo(() => queuedMonths[ns], [queuedMonths, ns]),
    clearQueue: useCallback(() => clearQueue(ns), [ns]),
    enqueueMonth: useCallback(
      (...values: MonthValue[]) => {
        enqueueMonth(ns, ...values)
      },
      [ns]
    ),
    dequeueMonth: useCallback(
      (...values: MonthValue[]) => {
        return dequeueMonth(ns, ...values)
      },
      [ns]
    )
  }
}
