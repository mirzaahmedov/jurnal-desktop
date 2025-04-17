import type { EditorComponentType } from './editors'
import type { ChangeContext, DeleteContext } from './editors/interfaces'
import type { Autocomplete } from '@/common/lib/types'
import type { HTMLAttributes, ReactNode, RefObject, SyntheticEvent } from 'react'
import type { ArrayPath, FieldArrayWithId, FieldErrors, UseFormReturn } from 'react-hook-form'

export type TableRowField<T extends object, F extends ArrayPath<T>> = FieldArrayWithId<T, F, 'id'>
export type InferRow<T extends object, F extends ArrayPath<T>> = T[F][number]

export type CellEventHandler<T extends object, F extends ArrayPath<T>> = (args: {
  event: SyntheticEvent<HTMLTableCellElement>
  row: FieldArrayWithId<T, F, 'id'>
  rows: FieldArrayWithId<T, F, 'id'>[]
  value: unknown
  onChange: (value: unknown) => void
  column: EditableColumnDef<InferRow<T, F>>
  index: number
}) => void

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
  divProps?: HTMLAttributes<HTMLDivElement>
  errors?: FieldErrors<{ childs: InferRow<T, F>[] }>['childs']
  getRowClassName?: (args: {
    index: number
    row: FieldArrayWithId<T, F, 'id'>
    rows: FieldArrayWithId<T, F, 'id'>[]
  }) => string
  getEditorProps?: (args: {
    index: number
    value: unknown
    onChange: (value: unknown) => void
    row: FieldArrayWithId<T, F, 'id'>
    rows: FieldArrayWithId<T, F, 'id'>[]
    col: EditableColumnDef<InferRow<T, F>>
    errors: FieldErrors<InferRow<T, F>>
  }) => Record<string, unknown>
  placeholder?: string
  onDelete?(ctx: DeleteContext): void
  onCreate?(): void
  onCellDoubleClick?: CellEventHandler<T, F>
  params?: Record<string, unknown>
  footerRows?: ReactNode
  validate?(ctx: ChangeContext<InferRow<T, F>>): boolean
  methods?: RefObject<EditableTableMethods>
}
