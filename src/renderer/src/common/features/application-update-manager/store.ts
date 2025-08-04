import { create } from 'zustand'

export interface UpdateManagerStore {
  isAvailable: boolean
  isRestarting: boolean
  setAvailable(isAvailable: boolean): void
  setRestarting(isRestarting: boolean): void
}

export const useUpdateManagerStore = create<UpdateManagerStore>((set) => ({
  isAvailable: false,
  isRestarting: false,
  setAvailable(isAvailable) {
    set({ isAvailable })
  },
  setRestarting(isRestarting) {
    set({ isRestarting })
  }
}))
