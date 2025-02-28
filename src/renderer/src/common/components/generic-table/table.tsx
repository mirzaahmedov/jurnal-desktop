import type { Autocomplete } from '@renderer/common/lib/types'

import { type ReactNode, type TableHTMLAttributes, useEffect, useState } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableFooter,
  TableHeader,
  type TableProps
} from '@renderer/common/components/ui/table'
import { formatNumber } from '@renderer/common/lib/format'
import { cn } from '@renderer/common/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

import { EmptyList } from '../empty-states'
import { GenericTableCell, GenericTableHead, GenericTableRow } from './components'

export type ColumnDef<T extends object> = {
  numeric?: boolean
  fit?: boolean
  stretch?: boolean
  key: Autocomplete<keyof T>
  header?: ReactNode
  className?: string
  width?: number
  headerClassName?: string
  rowSpan?: number
  colSpan?: number
  renderHeader?(row: T): ReactNode
  renderCell?(row: T, col: ColumnDef<T>): ReactNode
}

export type HeaderGroup<T extends object> = {
  numeric?: boolean
  fit?: boolean
  stretch?: boolean
  key: Autocomplete<keyof T>
  header?: ReactNode
  headerClassName?: string
  rowSpan?: number
  colSpan?: number
  width?: number
  renderHeader?(row: T): ReactNode
}

export type GenericTableProps<T extends object> = TableHTMLAttributes<HTMLTableElement> &
  TableProps & {
    caption?: string
    data: T[]
    columnDefs: ColumnDef<T>[]
    headerGroups?: HeaderGroup<T>[][]
    placeholder?: string
    selectedId?: number
    disabledIds?: number[]
    getRowId?(row: T): string | number
    onClickRow?(row: T): void
    onDelete?(row: T): void
    onEdit?(row: T): void
    customActions?: (row: T) => ReactNode
    activeRowId?: string | number
    footer?: ReactNode
  }
export const GenericTable = <T extends object>({
  caption,
  data,
  columnDefs,
  headerGroups = [columnDefs],
  placeholder,
  getRowId = defaultRowIdGetter,
  disabledIds = [],
  selectedId = 0,
  onClickRow,
  onDelete,
  onEdit,
  activeRowId,
  footer,
  customActions,
  ...props
}: GenericTableProps<T>) => {
  const [selectedRowRef, setSelectedRowRef] = useState<HTMLElement | null>(null)

  const { t } = useTranslation()

  useEffect(() => {
    if (selectedRowRef) {
      selectedRowRef.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [selectedRowRef])

  return (
    <Table
      {...props}
      className={twMerge('relative', props.className)}
    >
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader className="sticky top-0 z-50 artificial-border">
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
                        rowSpan,
                        width
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
                          style={{ width }}
                        >
                          {!header
                            ? t(key.toString())
                            : typeof header === 'string'
                              ? t(header)
                              : header}
                        </GenericTableHead>
                      )
                    })
                  : null}
                {onDelete || onEdit || customActions ? (
                  <GenericTableHead
                    fit
                    className="text-center"
                    key="actions"
                  >
                    {t('actions')}
                  </GenericTableHead>
                ) : null}
              </GenericTableRow>
            ))
          : null}
      </TableHeader>
      <TableBody>
        {Array.isArray(data) && data.length ? (
          data.map((row) => {
            return (
              <GenericTableRow
                key={getRowId(row)}
                onClick={() => onClickRow?.(row)}
                ref={(el) => {
                  if (activeRowId === getRowId(row)) {
                    setSelectedRowRef(el)
                  }
                }}
                className={cn(
                  'group',
                  activeRowId === getRowId(row) &&
                    'ring-2 ring-inset ring-offset-1 ring-brand transition-none',
                  disabledIds.includes(Number(getRowId(row))) && 'opacity-50 pointer-events-none'
                )}
                data-selected={selectedId === Number(getRowId(row))}
              >
                {Array.isArray(columnDefs)
                  ? columnDefs.map((col) => {
                      const { key, fit, stretch, numeric, renderCell, className, width } = col
                      return (
                        <GenericTableCell
                          key={key.toString()}
                          fit={fit}
                          stretch={stretch}
                          numeric={numeric}
                          className={cn(
                            activeRowId === getRowId(row) && 'text-brand/100',
                            className
                          )}
                          style={{ width }}
                        >
                          {typeof renderCell === 'function'
                            ? renderCell(row, col)
                            : defaultCellRenderer(row, col)}
                        </GenericTableCell>
                      )
                    })
                  : null}

                {onDelete || onEdit || customActions ? (
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
                      {customActions?.(row)}
                    </div>
                  </GenericTableCell>
                ) : null}
              </GenericTableRow>
            )
          })
        ) : (
          <GenericTableRow className="pointer-events-none">
            <GenericTableCell
              colSpan={100}
              className="w-full text-center py-20 text-slate-400"
            >
              <EmptyList
                iconProps={{
                  className: 'w-40'
                }}
              >
                {placeholder}
              </EmptyList>
            </GenericTableCell>
          </GenericTableRow>
        )}
      </TableBody>
      {footer ? <TableFooter>{footer}</TableFooter> : null}
    </Table>
  )
}

const defaultCellRenderer = <T extends object>(row: T, col: ColumnDef<T>): ReactNode => {
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
