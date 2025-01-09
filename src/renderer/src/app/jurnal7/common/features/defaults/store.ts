import { create } from 'zustand'
import { formatDate } from '@renderer/common/lib/date'
import { persist } from 'zustand/middleware'

type Jurnal7DefaultsStore = {
  from: string
  to: string
  setDates: (values: { from: string; to: string }) => void
}

export const useJurnal7DefaultsStore = create(
  persist<Jurnal7DefaultsStore>(
    (set) => ({
      from: '',
      to: '',
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
