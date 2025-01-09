import { create } from 'zustand'

type Jur7DefaultsStore = {
  date: string
  setDate: (date: string) => void
}

export const useJur7DefaultsStore = create<Jur7DefaultsStore>((set) => ({
  date: '',
  setDate: (date: string) => set({ date })
}))
