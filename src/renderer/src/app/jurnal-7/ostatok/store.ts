import { getFirstDayOfMonth, getLastDayOfMonth } from '@renderer/common/lib/date'
import { create } from 'zustand'

export interface MonthValue {
  year: number
  month: number
}

export interface OstatokStore {
  minDate: Date
  maxDate: Date
  queuedMonths: MonthValue[]
  clearQueue: VoidFunction
  enqueueMonth: (...values: MonthValue[]) => void
  dequeueMonth: (...values: MonthValue[]) => MonthValue[]
  recheckOstatok?: VoidFunction
  setRecheckOstatok: (recheckOstatok: VoidFunction) => void
  setDate: (date: Date) => void
}

export const useOstatokStore = create<OstatokStore>((set, get) => ({
  minDate: getFirstDayOfMonth(),
  maxDate: getLastDayOfMonth(),
  queuedMonths: [],
  enqueueMonth: (...values) => {
    const newValues = [...get().queuedMonths]
    values.forEach((value) => {
      const exists = newValues.find((v) => v.month === value.month && v.year === value.year)
      if (!exists) {
        newValues.push(value)
      }
    })
    newValues.sort(compareMonthValues)
    set({
      queuedMonths: newValues
    })
  },
  dequeueMonth(...values) {
    const newValues = [...get().queuedMonths]
    values.forEach((value) => {
      const index = newValues.findIndex((v) => v.month === value.month && v.year === value.year)
      if (index !== -1) {
        newValues.splice(index, 1)
      }
    })

    newValues.sort(compareMonthValues)
    set({
      queuedMonths: newValues
    })
    return newValues
  },
  clearQueue() {
    set({ queuedMonths: [] })
  },
  setRecheckOstatok: (recheckOstatok) => {
    set({
      recheckOstatok
    })
  },
  setDate: (date: Date) => {
    set({
      minDate: getFirstDayOfMonth(date),
      maxDate: getLastDayOfMonth(date)
    })
  }
}))

export const compareMonthValues = (a: MonthValue, b: MonthValue) => {
  return a.year - b.year || a.month - b.month
}
