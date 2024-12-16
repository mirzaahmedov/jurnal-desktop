import { create } from 'zustand'

export type ConfirmationState = {
  isOpen: boolean
  title?: string
  description?: string
  onConfirm?(): void
  onCancel?(): void
}

export type ConfirmationActions = {
  confirm(payload: Omit<ConfirmationState, 'isOpen'>): void
  close(): void
}

export const useConfirm = create<ConfirmationState & ConfirmationActions>((set) => ({
  isOpen: false,
  confirm: (payload) => {
    const { title, description, onConfirm, onCancel } = payload
    set({
      title,
      description,
      onConfirm,
      onCancel,
      isOpen: true
    })
  },
  close: () =>
    set({
      title: undefined,
      description: undefined,
      onConfirm: undefined,
      onCancel: undefined,
      isOpen: false
    })
}))
