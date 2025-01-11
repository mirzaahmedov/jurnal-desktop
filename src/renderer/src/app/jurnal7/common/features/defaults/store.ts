import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@renderer/common/lib/date'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Jurnal7DefaultsStore = {
  from: string
  to: string
  setDates: (values: { from: string; to: string }) => void
}

export const useJurnal7DefaultsStore = create(
  persist<Jurnal7DefaultsStore>(
    (set) => ({
      from: formatDate(getFirstDayOfMonth()),
      to: formatDate(getLastDayOfMonth()),
      setDates: ({ from, to }) => {
        set({
          from: formatDate(from),
          to: formatDate(to)
        })
      }
    }),
    {
      name: 'jurnal7-defaults'
    }
  )
)
