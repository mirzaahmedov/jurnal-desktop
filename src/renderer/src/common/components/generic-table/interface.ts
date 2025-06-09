import type { TableProps } from '@/common/components/ui/table'
import type { Autocomplete } from '@/common/lib/types'
import type { CheckedState } from '@radix-ui/react-checkbox'
import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from 'react'

export enum TableSortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type CellRenderer<T extends object> = (
  row: T,
  col: ColumnDef<T>,
  tableProps: GenericTableProps<T>
) => ReactNode

export interface ColumnDef<T extends object> {
  numeric?: boolean
  fit?: boolean
  fill?: boolean
  stretch?: boolean
  sort?: boolean
  key: Autocomplete<keyof T>
  header?: ReactNode
  className?: string
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  headerClassName?: string
  renderHeader?(): ReactNode
  renderCell?: CellRenderer<T>
  columns?: ColumnDef<T>[]
}

export type HeaderColumnDef<T> = T & {
  _depth: number
  _colSpan: number
  _rowSpan: number
}

export interface GenericTableProps<T extends object>
  extends TableHTMLAttributes<HTMLTableElement>,
    TableProps {
  caption?: string
  data: T[]
  headerProps?: HTMLAttributes<HTMLTableSectionElement>
  columnDefs: ColumnDef<T>[]
  placeholder?: string
  selectedIds?: number[]
  disabledIds?: number[]
  getRowId?: (row: T) => string | number
  getRowKey?: (row: T) => string | number
  getRowSelected?: GetRowSelectedFn<T>
  getRowEditable?: (row: T) => boolean
  getRowDeletable?: (row: T) => boolean
  getRowClassName?: (row: T) => string
  getColumnSorted?: (column: ColumnDef<T>) => TableSortDirection | undefined
  onClickRow?(row: T): void
  onDelete?(row: T): void
  onEdit?(row: T): void
  onView?(row: T): void
  onSort?(column: ColumnDef<T>, direction: TableSortDirection | undefined): void
  actions?: (row: T) => ReactNode
  activeRowId?: string | number
  footer?: ReactNode
  params?: Record<string, unknown>
}

export type GetRowSelectedFn<T> = (args: {
  row: T
  selectedIds: number[]
  getRowId: (row: T) => number | string
}) => CheckedState
