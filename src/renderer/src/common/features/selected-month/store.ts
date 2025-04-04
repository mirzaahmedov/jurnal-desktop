import { create } from 'zustand'

export interface SelectedMonthStore {
  selectedMonth: Date
  setSelectedMonth: (month: Date) => void
  resetSelectedMonth: () => void
}

export const useSelectedMonthStore = create<SelectedMonthStore>((set) => ({
  selectedMonth: new Date(),
  setSelectedMonth: (month: Date) => set({ selectedMonth: month }),
  resetSelectedMonth: () => set({ selectedMonth: new Date() })
}))
