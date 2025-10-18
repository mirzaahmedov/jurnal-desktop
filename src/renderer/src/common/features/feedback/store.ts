import { create } from 'zustand'

export const useFeedbackModalState = create<{
  details: string | null
  isOpen: boolean
  open(details: string): void
  close(): void
}>((set) => ({
  details: null,
  isOpen: false,
  open(details: string) {
    set({ isOpen: true, details })
  },
  close() {
    set({ isOpen: false, details: null })
  }
}))
