import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ZarplataStore {
  calculateParamsId: number
  setCalculateParamsId: (id: number) => void
}

export const useZarplataStore = create(
  persist<ZarplataStore>(
    (set) => ({
      calculateParamsId: 0,
      setCalculateParamsId: (id) =>
        set({
          calculateParamsId: id
        })
    }),
    {
      name: 'zarplata-store'
    }
  )
)
