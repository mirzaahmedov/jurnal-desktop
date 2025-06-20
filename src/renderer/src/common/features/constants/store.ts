import type { Constant, PodpisType, Position } from '@/common/models'

import { create } from 'zustand'

export interface ConstantsState {
  positions: Position[]
  podpisTypes: PodpisType[]
  regions: Constant.Region[]
  districts: Constant.District[]
}

export interface ConstantsStore extends ConstantsState {
  setConstants: (constants: Partial<ConstantsState>) => void
}

export const useConstantsStore = create<ConstantsStore>((set) => ({
  positions: [],
  podpisTypes: [],
  regions: [],
  districts: [],
  setConstants: (constants) => set(constants)
}))
