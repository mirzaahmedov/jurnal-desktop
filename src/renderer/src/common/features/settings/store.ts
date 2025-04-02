import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'

export interface SettingsStore {
  default_start_date: string
  default_end_date: string
  report_title_id?: number
  setSettings: (
    values: Pick<SettingsStore, 'report_title_id' | 'default_start_date' | 'default_end_date'>
  ) => void
}

export const useSettingsStore = create(
  persist<SettingsStore>(
    (set) => ({
      default_start_date: formatDate(getFirstDayOfMonth()),
      default_end_date: formatDate(getLastDayOfMonth()),
      setSettings: ({ default_start_date, default_end_date, report_title_id }) => {
        set({
          default_start_date,
          default_end_date,
          report_title_id
        })
      }
    }),
    {
      name: 'settings'
    }
  )
)
