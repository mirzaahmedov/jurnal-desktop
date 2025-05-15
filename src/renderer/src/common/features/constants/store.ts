import type { PodpisType } from '@/common/models'

import { create } from 'zustand'

export interface ConstantsState {
  podpisTypes: PodpisType[]
}

export interface ConstantsStore extends ConstantsState {
  setConstants: (constants: Partial<ConstantsState>) => void
}

export const useConstantsStore = create<ConstantsStore>((set) => ({
  podpisTypes: [],
  setConstants: (constants) => set(constants)
}))
