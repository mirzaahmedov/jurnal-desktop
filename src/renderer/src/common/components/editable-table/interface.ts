import type { EditorComponentType } from './editors'
import type { ChangeContext, DeleteContext } from './editors/interfaces'
import type { Autocomplete } from '@/common/lib/types'
import type { ReactNode, RefObject } from 'react'
import type { ArrayPath, FieldArrayWithId, FieldErrors, UseFormReturn } from 'react-hook-form'

export type TableRowField<T extends object> = FieldArrayWithId<T, ArrayPath<T>, 'id'>
export type InferRow<T extends object, F extends ArrayPath<NoInfer<T>>> = T[F][number]

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

export interface EditableTableProps<T extends object, F extends ArrayPath<NoInfer<T>>> {
  tableRef?: RefObject<HTMLTableElement>
  tabIndex?: number
  form: UseFormReturn<T>
  name: F
  columnDefs: EditableColumnDef<InferRow<T, F>>[]
  className?: string
  errors?: FieldErrors<{ childs: InferRow<T, F>[] }>['childs']
  getRowClassName?: (args: {
    index: number
    row: TableRowField<InferRow<T, F>>
    rows: TableRowField<InferRow<T, F>>[]
  }) => string
  getEditorProps?: (args: {
    index: number
    row: TableRowField<InferRow<T, F>>
    rows: TableRowField<InferRow<T, F>>[]
    col: EditableColumnDef<InferRow<T, F>>
    errors: FieldErrors<InferRow<T, F>>
  }) => Record<string, unknown>
  placeholder?: string
  onDelete?(ctx: DeleteContext): void
  onCreate?(): void
  onCellDoubleClick?: (ctx: {
    row: TableRowField<InferRow<T, F>>
    col: EditableColumnDef<InferRow<T, F>>
    index: number
  }) => void
  params?: Record<string, unknown>
  footerRows?: ReactNode
  validate?(ctx: ChangeContext<InferRow<T, F>>): boolean
  methods?: RefObject<EditableTableMethods>
}
