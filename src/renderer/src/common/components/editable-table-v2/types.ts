import type { ReactNode, Ref } from 'react'
import type { FieldError, FieldErrors, SetValueConfig, UseFormReturn } from 'react-hook-form'

export type SortDirection = 'desc' | 'asc'
export type SortFunction<T> = (a: T, b: T, direction: SortDirection) => number
export type SortRule<T> = {
  column: keyof T & string
  direction: SortDirection
  sortFn?: SortFunction<T>
}

export interface BaseColumnDef<TRow extends object> {
  key: keyof TRow & string
  header: ReactNode | (() => ReactNode)
  sort?: boolean
  sortFn?: SortFunction<TRow>
  filter?: boolean
  filterFn?: (value: string, row: TRow) => boolean
  sticky?: boolean
  left?: number
  right?: number
  size?: number
  minSize?: number
  maxSize?: number
}

export interface RenderProps<TRow extends object> {
  inputRef: Ref<HTMLInputElement>
  rowIndex: number
  value: unknown
  error?: FieldError
  rowErrors: FieldErrors<TRow>
  form: UseFormReturn<any>
  column: ColumnDef<TRow>
  onChange: (value: unknown) => void
  rowValues: TRow
  setRowValues: (values: TRow, options?: SetValueConfig) => void
  setRowFieldValue: (fieldName: keyof TRow & string, value: any, options?: SetValueConfig) => void
}
export interface LeafColumnDef<TRow extends object> extends BaseColumnDef<TRow> {
  columns?: never
  render: (props: RenderProps<TRow>) => ReactNode
}

export interface GroupColumnDef<TRow extends object> extends BaseColumnDef<TRow> {
  columns: ColumnDef<TRow>[]
  render?: never
}

export type ColumnDef<TRow extends object> = GroupColumnDef<TRow> | LeafColumnDef<TRow>
