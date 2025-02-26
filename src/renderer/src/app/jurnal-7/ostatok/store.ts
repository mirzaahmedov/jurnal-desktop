import { getFirstDayOfMonth, getLastDayOfMonth } from '@renderer/common/lib/date'
import { create } from 'zustand'

export interface OstatokStore {
  minDate: Date
  maxDate: Date
  setDate: (date: Date) => void
}

export const useOstatokStore = create<OstatokStore>((set) => ({
  minDate: getFirstDayOfMonth(),
  maxDate: getLastDayOfMonth(),
  setDate: (date: Date) => {
    set({
      minDate: getFirstDayOfMonth(date),
      maxDate: getLastDayOfMonth(date)
    })
  }
}))
