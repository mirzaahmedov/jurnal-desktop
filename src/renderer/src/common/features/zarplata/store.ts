import { create } from 'zustand'

interface ZarplataStore {
  calculateParamsId: number
  setCalculateParamsId: (id: number) => void
}

export const useZarplataStore = create<ZarplataStore>((set) => ({
  calculateParamsId: 0,
  setCalculateParamsId: (id) =>
    set({
      calculateParamsId: id
    })
}))
