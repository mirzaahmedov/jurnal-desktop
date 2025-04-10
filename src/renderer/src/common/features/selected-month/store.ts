import { create } from 'zustand'

import { getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'

export interface SelectedMonthStore {
  startDate: Date
  endDate: Date
  setSelectedMonth: (month: Date) => void
}

export const useSelectedMonthStore = create<SelectedMonthStore>((set) => ({
  startDate: getFirstDayOfMonth(new Date()),
  endDate: getLastDayOfMonth(new Date()),
  setSelectedMonth: (month: Date) =>
    set({
      startDate: getFirstDayOfMonth(month),
      endDate: getLastDayOfMonth(month)
    })
}))
