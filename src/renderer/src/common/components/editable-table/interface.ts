import type { EditorComponentType } from './editors'
import type { ChangeContext, DeleteContext } from './editors/interfaces'
import type { Autocomplete } from '@/common/lib/types'
import type { ReactNode, RefObject } from 'react'
import type { ArrayPath, FieldArrayWithId, FieldErrors, UseFormReturn } from 'react-hook-form'

export type EditableTableRowData<T extends object> = FieldArrayWithId<
  T,
  ArrayPath<NoInfer<T>>,
  'id'
>

export type InferRow<T extends object> = T[ArrayPath<NoInfer<T>>][number]

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

export interface EditableTableProps<T extends object, R extends InferRow<T> = InferRow<T>> {
  tableRef?: RefObject<HTMLTableElement>
  tabIndex?: number
  form: UseFormReturn<T>
  name: ArrayPath<NoInfer<T>>
  columnDefs: EditableColumnDef<NoInfer<R>>[]
  className?: string
  errors?: FieldErrors<{ childs: NoInfer<R>[] }>['childs']
  getRowClassName?: (args: {
    index: number
    row: EditableTableRowData<R>
    rows: EditableTableRowData<R>[]
  }) => string
  getEditorProps?: (args: {
    index: number
    row: EditableTableRowData<R>
    rows: EditableTableRowData<R>[]
    col: EditableColumnDef<R>
    errors: FieldErrors<R>
  }) => Record<string, unknown>
  placeholder?: string
  onDelete?(ctx: DeleteContext): void
  onCreate?(): void
  params?: Record<string, unknown>
  footerRows?: ReactNode
  validate?(ctx: ChangeContext<R>): boolean
  methods?: RefObject<EditableTableMethods>
}
