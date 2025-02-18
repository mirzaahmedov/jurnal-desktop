import type { ColumnDef } from '@/common/components'
import type { APIEndpoints, CRUDService } from '@/common/features/crud'
import type { DialogProps } from '@radix-ui/react-dialog'
import type { GenericTableProps } from '@renderer/common/components/generic-table/table'
import type { useToggle } from '@renderer/common/hooks'
import type { ComponentType, Dispatch, SetStateAction } from 'react'

import { create } from 'zustand'

export type FilterComponentProps<
  T extends Record<string, unknown> = Record<string, unknown>,
  K = keyof T | (string & {})
> = {
  getValue(name: K): undefined | string
  setValue(name: K, value: undefined | string): void
}

export type SpravochnikLocalState = Record<string, unknown>

export type SpravochnikDialogProps = DialogProps & {
  params: undefined | Record<string, unknown>
  state?: SpravochnikLocalState
  setState?: Dispatch<SetStateAction<SpravochnikLocalState>>
}
export type SpravochnikTableProps<T extends object> = {
  data: T[]
  columnDefs: ColumnDef<T>[]
  selectedRowId?: string
  onClickRow(row: T): void
  dialogToggle?: ReturnType<typeof useToggle>
  state?: SpravochnikLocalState
  setState?: Dispatch<SetStateAction<SpravochnikLocalState>>
}

export type SpravochnikData<T extends Record<string, unknown>> = {
  id: string
  endpoint: APIEndpoints
  title?: string
  service: CRUDService<T>
  selectId?: (id: number, data: T) => void
  onClose?: () => void
  queryKeys?: {
    getAll: string
    getById: string
  }
  columnDefs: ColumnDef<T>[]
  params?: Record<string, unknown>
  filters?: ComponentType<FilterComponentProps>[]
  defaultFilters?: Record<string, unknown>
  search?: boolean
  Dialog?: ComponentType<SpravochnikDialogProps>
  CustomTable?: ComponentType<SpravochnikTableProps<T>>
  tableProps?: Partial<GenericTableProps<T>>
}
export type SpravochnikStore<T extends Record<string, unknown>> = {
  isOpen: (id: string) => boolean
  open(spravochnik: SpravochnikData<T>): void
  close(id: string): void
  spravochniks: SpravochnikData<T>[]
}

export const useSpravochnikStore = create<SpravochnikStore<any>>((set, get) => ({
  isOpen: (id) => get().spravochniks.some((s) => s.id === id),
  open: (data) => {
    if (get().isOpen(data.id)) {
      return
    }
    set({ spravochniks: [...get().spravochniks, data] })
  },
  close: (id) => set({ spravochniks: get().spravochniks.filter((s) => s.id !== id) }),

  spravochniks: []
}))
