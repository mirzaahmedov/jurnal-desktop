import type { ComponentType, ReactNode } from 'react'

import { create } from 'zustand'

export interface Breadcrumb {
  path?: string
  title: string
}

export interface LayoutStore {
  title: ReactNode
  enableSaldo?: boolean
  breadcrumbs?: Breadcrumb[]
  content?: ComponentType | null
  onCreate?: () => void
  onBack?: () => void
  setLayout: (state: Omit<LayoutStore, 'setLayout'>) => void
}
export const useLayoutStore = create<LayoutStore>((set) => ({
  title: '',
  setLayout: ({ title, content = null, onCreate, onBack, breadcrumbs, enableSaldo }) =>
    set({
      title,
      breadcrumbs,
      content,
      enableSaldo,
      onCreate,
      onBack
    })
}))
