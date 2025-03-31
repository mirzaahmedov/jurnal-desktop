import type { EditorComponentType } from './editors'
import type { ChangeContext, DeleteContext } from './editors/types'
import type { Autocomplete } from '@renderer/common/lib/types'
import type { ReactNode, RefObject } from 'react'
import type { FieldErrors } from 'react-hook-form'

export interface EditableColumnDef<T extends object> {
  key: Autocomplete<keyof T>
  header?: ReactNode
  Editor: EditorComponentType<T>
  width?: number
  minWidth?: number
  maxWidth?: number
  className?: string
  headerClassName?: string
  columns?: EditableColumnDef<T>[]
}

export type HeaderColumnDef<T> = T & {
  _depth: number
  _colSpan: number
  _rowSpan: number
}

export interface EditableTableMethods {
  highlightRow: (rowIndex: number) => void
  setHighlightedRows: (values: number[]) => void
  scrollToRow: (rowIndex: number) => void
}

export interface EditableTableProps<T extends object> {
  tableRef?: RefObject<HTMLTableElement>
  tabIndex?: number
  data: T[]
  columnDefs: EditableColumnDef<T>[]
  className?: string
  errors?: FieldErrors<{ example: T[] }>['example']
  getRowClassName?: (args: { index: number; row: T; data: T[] }) => string
  placeholder?: string
  onDelete?(ctx: DeleteContext): void
  onChange?(ctx: ChangeContext<T>): void
  onCreate?(): void
  params?: Record<string, unknown>
  footerRows?: ReactNode
  validate?(ctx: ChangeContext<T>): boolean
  methods?: RefObject<EditableTableMethods>
}
