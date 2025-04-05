import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SidebarStore {
  isCollapsed: boolean
  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create(
  persist<SidebarStore>(
    (set, get) => ({
      isCollapsed: false,
      toggleCollapsed: () => set({ isCollapsed: !get().isCollapsed }),
      setCollapsed: (isCollapsed: boolean) => set({ isCollapsed })
    }),
    {
      name: 'sidebar'
    }
  )
)
