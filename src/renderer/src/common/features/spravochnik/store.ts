import type { APIEndpoints, CRUDService } from '@/common/features/crud'

import type { ColumnDef } from '@/common/components'
import type { ComponentType } from 'react'
import { create } from 'zustand'

export type FilterComponentProps<
  T extends Record<string, unknown> = Record<string, unknown>,
  K = keyof T | (string & {})
> = {
  getValue(name: K): undefined | string
  setValue(name: K, value: undefined | string): void
}

export type SpravochnikDataType<T extends Record<string, unknown>> = {
  endpoint: APIEndpoints
  title?: string
  service: CRUDService<T>
  columns: ColumnDef<T>[]
  params?: Record<string, unknown>
  filters?: ComponentType<FilterComponentProps>[]
  defaultFilters?: Record<string, unknown>
  search?: boolean
  CustomTable?: (props: {
    data: T[]
    columns: ColumnDef<T>[]
    selectedRowId?: string
    onClickRow(row: T): void
  }) => JSX.Element
}
export type SpravochnikStoreType<T extends Record<string, unknown>> = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  open(): void
  close(): void

  selectId?: (id: number, data: T) => void
  spravochnikId?: string
  setSelectId: (onSelect: undefined | ((id: number, data: T) => void)) => void
  setSpravochnikId: (spravochnikId?: string) => void

  data: null | SpravochnikDataType<T>
  setSpravochnik: (data: null | SpravochnikDataType<T>) => void
}

export const useSpravochnikStore = create<SpravochnikStoreType<any>>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open, data: null }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, data: null }),

  setSelectId: (onSelect) => set({ selectId: onSelect }),
  setSpravochnikId: (spravochnikId) => set({ spravochnikId }),

  data: null,
  setSpravochnik: (data) => set({ data })
}))
