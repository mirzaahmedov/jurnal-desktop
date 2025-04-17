import type { MonthValue, SaldoNamespace } from './interfaces'

import { useCallback, useMemo } from 'react'

import { useSaldoControllerStore } from './store'

export interface UseSaldoControllerReturn<T> {
  queuedMonths: T[]
  clearQueue: () => void
  enqueueMonth: (...values: T[]) => void
  dequeueMonth: (...values: T[]) => boolean
}
export interface UseSaldoControllerArgs {
  ns: SaldoNamespace
}
export const useSaldoController = <T extends MonthValue = MonthValue>({
  ns
}: UseSaldoControllerArgs) => {
  const { queuedMonths, clearQueue, enqueueMonth, dequeueMonth } = useSaldoControllerStore()

  return {
    queuedMonths: useMemo(() => queuedMonths[ns] as T[], [queuedMonths, ns]),
    clearQueue: useCallback(() => clearQueue(ns), [ns]),
    enqueueMonth: useCallback(
      (...values: T[]) => {
        enqueueMonth(ns, ...values)
      },
      [ns]
    ),
    dequeueMonth: useCallback(
      (...values: T[]) => {
        return dequeueMonth(ns, ...values)
      },
      [ns]
    )
  }
}
