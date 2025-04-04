import { type ComponentType, useEffect } from 'react'

import { create } from 'zustand'

import { useEventCallback } from '@/common/hooks/use-event-callback'

export interface Breadcrumb {
  path?: string
  title: string
}

export interface LayoutStore {
  title: string
  breadcrumbs?: Breadcrumb[]
  content?: ComponentType
  onCreate?: () => void
  onBack?: () => void
  setLayout: (state: Omit<LayoutStore, 'setLayout'>) => void
}
export const useLayoutStore = create<LayoutStore>((set) => ({
  title: '',
  setLayout: ({ title, content, onCreate, onBack, breadcrumbs }) =>
    set({
      title,
      breadcrumbs,
      content,
      onCreate,
      onBack
    })
}))

export type UseLayoutParams = {
  title: string
  content?: ComponentType
  onCreate?: () => void
  onBack?: () => void
}
export const useLayout = ({ title, content, onCreate, onBack }: UseLayoutParams) => {
  const { setLayout } = useLayoutStore()

  const onCreateCallback = useEventCallback(onCreate)
  const onBackCallback = useEventCallback(onBack)

  useEffect(() => {
    setLayout({
      title,
      content,
      onCreate: onCreateCallback,
      onBack: onBackCallback
    })
  }, [setLayout, title, content, onCreateCallback, onBackCallback])
}
