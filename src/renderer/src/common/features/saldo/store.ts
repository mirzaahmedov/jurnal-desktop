import { create } from 'zustand'

import { type SaldoControllerStore, SaldoNamespace } from './interfaces'
import { compareMonthValues } from './utils'

export const useSaldoControllerStore = create<SaldoControllerStore>((set, get) => ({
  queuedMonths: {
    [SaldoNamespace.JUR_1]: [],
    [SaldoNamespace.JUR_2]: [],
    [SaldoNamespace.JUR_7]: []
  },
  enqueueMonth: (ns, ...values) => {
    const queuedMonths = get().queuedMonths
    const newValues = [...queuedMonths[ns]]
    values.forEach((value) => {
      const exists = newValues.find((v) => v.month === value.month && v.year === value.year)
      if (!exists) {
        newValues.push(value)
      }
    })
    newValues.sort(compareMonthValues)
    set({
      queuedMonths: {
        ...queuedMonths,
        [ns]: newValues
      }
    })
  },
  dequeueMonth(ns, ...values) {
    const queuedMonths = get().queuedMonths
    const newValues = [...queuedMonths[ns]]
    values.forEach((value) => {
      const index = newValues.findIndex((v) => v.month === value.month && v.year === value.year)
      if (index !== -1) {
        newValues.splice(index, 1)
      }
    })

    newValues.sort(compareMonthValues)
    set({
      queuedMonths: {
        ...queuedMonths,
        [ns]: newValues
      }
    })
    return newValues
  },
  clearQueue(ns) {
    const queuedMonths = get().queuedMonths
    set({
      queuedMonths: {
        ...queuedMonths,
        [ns]: []
      }
    })
  }
}))
