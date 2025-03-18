import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'

export interface DefaultFiltersState {
  from: string
  to: string
}
export interface DefaultFiltersStore extends DefaultFiltersState {
  setDefaultFilters: (filters: Partial<DefaultFiltersState>) => void
}

export const useDefaultFilters = create<DefaultFiltersStore>()(
  persist(
    (set) => ({
      from: formatDate(getFirstDayOfMonth()),
      to: formatDate(getLastDayOfMonth()),
      setDefaultFilters: (filters) => {
        set(filters)
      }
    }),
    {
      name: 'default-filters'
    }
  )
)

export interface SettingsStore {
  report_title_id?: number
  setSettings: (values: Pick<SettingsStore, 'report_title_id'>) => void
}

export const useSettingsStore = create(
  persist<SettingsStore>(
    (set) => ({
      setSettings: ({ report_title_id }) => {
        set({ report_title_id })
      }
    }),
    {
      name: 'settings'
    }
  )
)
