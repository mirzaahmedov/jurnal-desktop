import { create } from 'zustand'

export const useFeedbackModalState = create<{
  isOpen: boolean
  open: VoidFunction
  close: VoidFunction
}>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}))
