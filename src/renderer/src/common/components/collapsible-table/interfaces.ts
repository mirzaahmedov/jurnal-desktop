import type { ColumnDef, GetRowSelectedFn } from '../generic-table'
import type { ReactNode } from 'react'

export type CollapsibleCellRenderer<T extends object> = (
  row: T,
  col: CollapsibleColumnDef<T>,
  tableProps: CommonCollapsibleTableProps<T>
) => ReactNode

export interface CollapsibleColumnDef<T extends object> extends Omit<ColumnDef<T>, 'renderCell'> {
  renderCell?: CollapsibleCellRenderer<T>
}

interface CommonCollapsibleTableProps<T extends object> {
  displayHeader?: boolean
  data: T[]
  columnDefs: CollapsibleColumnDef<NoInfer<T>>[]
  width?: number
  disabledIds?: number[]
  selectedIds?: number[]
  className?: string
  params?: Record<string, unknown>
  getRowId: (row: T) => number | string
  getRowKey?: (row: T, rowIndex: number) => string | number
  getRowSelected?: GetRowSelectedFn<T>
  onClickRow?: (row: T) => void
  onView?(row: T): void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  openRows?: (string | number)[]
  onOpenRowsChange?: (openRows: (string | number)[]) => void
  classNames?: {
    header?: string
  }
}

export interface CollapsibleTableCustomProps<T extends object, C extends object>
  extends CommonCollapsibleTableProps<T> {
  children: (props: {
    row: T
    tableProps: CollapsibleTableProps<T, C>
    rowIndex: number
  }) => ReactNode
  getChildRows?: never
}
export interface CollapsibleTableDefaulteProps<T extends object, C extends object>
  extends CommonCollapsibleTableProps<T> {
  children?: never
  getChildRows: (row: T) => C[]
}

export type CollapsibleTableProps<T extends object, C extends object> =
  | CollapsibleTableCustomProps<T, C>
  | CollapsibleTableDefaulteProps<T, C>
