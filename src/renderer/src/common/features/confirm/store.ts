import { create } from 'zustand'

export interface ConfirmWithPassword {
  password: true
  title?: string
  description?: string
  onConfirm?(password: string): void
  onCancel?(): void
}

export interface ConfirmWithoutPassword {
  password?: false
  title?: string
  description?: string
  onConfirm?(): void
  onCancel?(): void
}

export interface ConfirmationState {
  password?: boolean
  onConfirm?(password?: string): void
  isOpen: boolean
  title?: string
  description?: string
  onCancel?(): void
}

export interface ConfirmationActions {
  confirm(values: ConfirmWithPassword): void
  confirm(values: ConfirmWithoutPassword): void
  close(): void
}

export const useConfirm = create<ConfirmationState & ConfirmationActions>((set) => ({
  isOpen: false,
  password: false,
  confirm: ({
    title,
    password = false,
    description,
    onConfirm,
    onCancel
  }: ConfirmWithPassword | ConfirmWithoutPassword) => {
    set({
      title,
      password: password as any,
      description,
      onConfirm,
      onCancel,
      isOpen: true
    })
  },
  close: () =>
    set({
      title: undefined,
      password: false,
      description: undefined,
      onConfirm: undefined,
      onCancel: undefined,
      isOpen: false
    })
}))
