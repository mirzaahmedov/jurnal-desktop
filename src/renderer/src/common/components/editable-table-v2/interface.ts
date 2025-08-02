import type { EditorComponentType } from './editors'
import type { ChangeContext } from './editors/interfaces'
import type { Autocomplete } from '@/common/lib/types'
import type { HTMLAttributes, ReactNode, RefObject, SyntheticEvent } from 'react'
import type {
  ArrayPath,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormReturn
} from 'react-hook-form'

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

export interface EditableColumnDef<T extends object, F extends ArrayPath<T> = ArrayPath<T>> {
  key: Autocomplete<keyof T>
  header?: ReactNode
  Editor: EditorComponentType<T, F>
  width?: number
  minWidth?: number
  maxWidth?: number
  className?: string
  headerClassName?: string
  columns?: EditableColumnDef<T, F>[]
}

export type HeaderColumnDef<T> = T & {
  _depth: number
  _colSpan: number
  _rowSpan: number
}

export interface EditableTableMethods {
  scrollToRow: (rowIndex: number) => void
}

export interface CreateHandlerArgs<T extends object, F extends ArrayPath<T>> {
  fieldArray: UseFieldArrayReturn<T, F, 'id'>
}
export interface DeleteHandlerArgs<T extends object, F extends ArrayPath<T>> {
  id: number
  fieldArray: UseFieldArrayReturn<T, F, 'id'>
}
export interface DuplicateHandlerArgs<T extends object, F extends ArrayPath<T>> {
  index: number
  row: TableRowField<T, F>
  fieldArray: UseFieldArrayReturn<T, F, 'id'>
}

export interface EditableTableProps<T extends object, F extends ArrayPath<NoInfer<T>>> {
  tableRef?: RefObject<HTMLTableElement>
  tabIndex?: number
  form: UseFormReturn<T>
  name: F
  height?: number
  columnDefs: EditableColumnDef<InferRow<T, F>>[]
  className?: string
  divProps?: HTMLAttributes<HTMLDivElement>
  errors?: FieldErrors<{ childs: InferRow<T, F>[] }>['childs']
  disableHeader?: boolean
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
  onDelete?(ctx: DeleteHandlerArgs<NoInfer<T>, NoInfer<F>>): void
  onDuplicate?(ctx: DuplicateHandlerArgs<NoInfer<T>, NoInfer<F>>): void
  onCreate?(args: CreateHandlerArgs<NoInfer<T>, NoInfer<F>>): void
  onCellDoubleClick?: CellEventHandler<NoInfer<T>, NoInfer<F>>
  params?: Record<string, unknown>
  footerRows?: ReactNode
  validate?(ctx: ChangeContext<InferRow<T, F>>): boolean
  methods?: RefObject<EditableTableMethods>
  isRowVisible?: (args: {
    row: FieldArrayWithId<T, F, 'id'>
    index: number
    rows: FieldArrayWithId<T, F, 'id'>[]
  }) => boolean
}
