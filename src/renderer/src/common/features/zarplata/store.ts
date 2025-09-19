import type { MainZarplata } from '@/common/models'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export enum PassportInfoTabs {
  Main = 'main',
  Employment = 'employment',
  AdditionalDocument = 'dop-oplata',
  Payroll = 'payroll',
  SeperateCalculation = 'seperate-calculation',
  BankCard = 'bank_card'
}

interface ZarplataStore {
  calculateParamsId: number
  mainZarplataId: number | null
  mainZarplataViewList: MainZarplata[] | null
  currentTab: PassportInfoTabs
  setCurrentTab: (tab: PassportInfoTabs) => void
  setCalculateParamsId: (id: number) => void
  openMainZarplataView: (id: number | null, viewList?: MainZarplata[] | null) => void
}

export const useZarplataStore = create(
  persist<ZarplataStore>(
    (set) => ({
      calculateParamsId: 0,
      mainZarplataId: null,
      mainZarplataViewList: null,
      currentTab: PassportInfoTabs.Main,
      setCalculateParamsId: (id) =>
        set({
          calculateParamsId: id
        }),
      setCurrentTab: (tab) =>
        set({
          currentTab: tab
        }),
      openMainZarplataView: (id, viewList = null) =>
        set({
          mainZarplataId: id,
          mainZarplataViewList: viewList
        })
    }),
    {
      name: 'zarplata-store',
      partialize: (state) => {
        return Object.fromEntries(
          Object.entries(state).filter(([key]) => key === 'calculateParamsId')
        ) as ZarplataStore
      }
    }
  )
)
