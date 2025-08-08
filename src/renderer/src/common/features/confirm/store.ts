import { create } from 'zustand'

export interface ConfirmWithPassword {
  danger?: boolean
  withPassword: true
  title?: string
  description?: string
  onConfirm?(password: string): void
  onCancel?(): void
}

export interface ConfirmWithoutPassword {
  danger?: boolean
  withPassword?: false
  title?: string
  description?: string
  onConfirm?(): void
  onCancel?(): void
}

export interface ConfirmationState {
  withPassword?: boolean
  onConfirm?(password?: string): void
  isOpen: boolean
  danger?: boolean
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
  withPassword: false,
  confirm: ({
    danger = true,
    title,
    withPassword = false,
    description,
    onConfirm,
    onCancel
  }: ConfirmWithPassword | ConfirmWithoutPassword) => {
    set({
      title,
      danger,
      withPassword,
      description,
      onConfirm,
      onCancel,
      isOpen: true
    })
  },
  close: () =>
    set({
      title: undefined,
      danger: false,
      withPassword: false,
      description: undefined,
      onConfirm: undefined,
      onCancel: undefined,
      isOpen: false
    })
}))
