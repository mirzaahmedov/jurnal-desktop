import { useEffect, useState, type ReactNode, type TableHTMLAttributes } from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableFooter,
  TableHeader,
  type TableProps
} from '@/common/components/ui/table'
import { Button } from '@/common/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { formatNumber } from '@/common/lib/format'
import { GenericTableCell, GenericTableHead, GenericTableRow } from './components'
import type { Autocomplete } from '@/common/lib/types'
import { cn } from '@/common/lib/utils'

export type ColumnDef<T extends Record<string, unknown>> = {
  numeric?: boolean
  fit?: boolean
  stretch?: boolean
  key: Autocomplete<keyof T>
  header: ReactNode
  className?: string
  headerClassName?: string
  rowSpan?: number
  colSpan?: number
  renderHeader?(row: T): ReactNode
  renderCell?(row: T, col: ColumnDef<T>): ReactNode
}

export type HeaderGroup<T extends Record<string, unknown>> = {
  numeric?: boolean
  fit?: boolean
  stretch?: boolean
  key: Autocomplete<keyof T>
  header: ReactNode
  headerClassName?: string
  rowSpan?: number
  colSpan?: number
  renderHeader?(row: T): ReactNode
}

export type GenericTableProps<T extends Record<string, unknown>> =
  TableHTMLAttributes<HTMLTableElement> &
    TableProps & {
      caption?: string
      data: T[]
      columnDefs: ColumnDef<T>[]
      headerGroups?: HeaderGroup<T>[][]
      placeholder?: string
      getRowId?(row: T): string | number
      onClickRow?(row: T): void
      onDelete?(row: T): void
      onEdit?(row: T): void
      selectedRowId?: string | number
      footer?: ReactNode
    }
export const GenericTable = <T extends Record<string, unknown>>({
  caption,
  data,
  columnDefs,
  headerGroups = [columnDefs],
  placeholder,
  getRowId = defaultRowIdGetter,
  onClickRow,
  onDelete,
  onEdit,
  selectedRowId,
  footer,
  ...props
}: GenericTableProps<T>) => {
  const [selectedRowRef, setSelectedRowRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (selectedRowRef) {
      selectedRowRef.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [selectedRowRef])

  return (
    <Table {...props}>
      {caption ? <TableCaption>A list of your recent invoices.</TableCaption> : null}
      <TableHeader>
        {Array.isArray(headerGroups)
          ? headerGroups.map((headerGroup, index) => (
              <GenericTableRow
                key={index}
                className="hover:bg-slate-100 border-t border-slate-200 bg-slate-100 even:bg-slate-100 even:hover:bg-slate-100"
              >
                {Array.isArray(headerGroup)
                  ? headerGroup.map((col) => {
                      const {
                        key,
                        header,
                        fit,
                        stretch,
                        numeric,
                        headerClassName,
                        colSpan,
                        rowSpan
                      } = col
                      return (
                        <GenericTableHead
                          key={key.toString()}
                          numeric={numeric}
                          fit={fit}
                          stretch={stretch}
                          className={headerClassName}
                          colSpan={colSpan}
                          rowSpan={rowSpan}
                        >
                          {header}
                        </GenericTableHead>
                      )
                    })
                  : null}
                {onDelete || onEdit ? (
                  <GenericTableHead
                    fit
                    className="text-center"
                    key="actions"
                  >
                    Действие
                  </GenericTableHead>
                ) : null}
              </GenericTableRow>
            ))
          : null}
      </TableHeader>
      <TableBody>
        {Array.isArray(data) && data.length ? (
          data.map((row) => (
            <GenericTableRow
              key={getRowId(row)}
              onClick={() => onClickRow?.(row)}
              ref={(el) => {
                if (selectedRowId === getRowId(row)) {
                  setSelectedRowRef(el)
                }
              }}
              className={cn(
                selectedRowId === getRowId(row) &&
                  'bg-brand/5 even:bg-brand/5 hover:bg-brand/5 transition-none'
              )}
            >
              {Array.isArray(columnDefs)
                ? columnDefs.map((col) => {
                    const { key, fit, stretch, numeric, renderCell, className } = col
                    console.log(col, key, key.toString())
                    return (
                      <GenericTableCell
                        key={key.toString()}
                        fit={fit}
                        stretch={stretch}
                        numeric={numeric}
                        className={cn(
                          selectedRowId === getRowId(row) && 'text-brand/100',
                          className
                        )}
                      >
                        {typeof renderCell === 'function'
                          ? renderCell(row, col)
                          : defaultCellRenderer(row, col)}
                      </GenericTableCell>
                    )
                  })
                : null}

              {onDelete || onEdit ? (
                <GenericTableCell className="py-1">
                  <div className="flex items-center whitespace-nowrap w-full gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(row)
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(row)
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </GenericTableCell>
              ) : null}
            </GenericTableRow>
          ))
        ) : (
          <GenericTableRow className="pointer-events-none">
            <GenericTableCell
              colSpan={100}
              className="w-full text-center py-20 text-slate-400"
            >
              {placeholder ?? 'Нет данных для отображения'}
            </GenericTableCell>
          </GenericTableRow>
        )}
      </TableBody>
      {footer ? <TableFooter>{footer}</TableFooter> : null}
    </Table>
  )
}

const defaultCellRenderer = <T extends Record<string, unknown>>(
  row: T,
  col: ColumnDef<T>
): ReactNode => {
  if (col.numeric) {
    return row[col.key as keyof T] ? formatNumber(Number(row[col.key as keyof T])) : '-'
  }
  return row[col.key as keyof T] ? String(row[col.key as keyof T]) : '-'
}
const defaultRowIdGetter = <T,>(row: T): string => {
  if (row !== null && typeof row === 'object' && 'id' in row) {
    return String(row['id'])
  }
  return ''
}
