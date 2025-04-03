import { type ReactNode, useEffect, useMemo, useState } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableFooter,
  TableHeader
} from '@renderer/common/components/ui/table'
import { formatNumber } from '@renderer/common/lib/format'
import { cn } from '@renderer/common/lib/utils'
import { ArrowDown10, ArrowDownNarrowWide, ArrowUp01, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

import { EmptyList } from '../empty-states'
import { GenericTableCell, GenericTableHead, GenericTableRow } from './components'
import { type ColumnDef, type GenericTableProps, TableSortDirection } from './interface'
import { getAccessorColumns, getHeaderGroups } from './utils'

export const GenericTable = <T extends object>(props: GenericTableProps<T>) => {
  const {
    caption,
    data,
    columnDefs,
    headerProps,
    placeholder,
    getRowId = defaultGetRowId,
    getRowKey = getRowId,
    getColumnSorted,
    disabledIds = [],
    selectedIds = [],
    onClickRow,
    onDelete,
    onEdit,
    onSort,
    activeRowId,
    footer,
    actions,
    ...tableProps
  } = props

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

  const headerGroups = useMemo(
    () => (Array.isArray(columnDefs) ? getHeaderGroups(columnDefs) : []),
    [columnDefs]
  )
  const accessorColumns = useMemo(
    () => (Array.isArray(columnDefs) ? getAccessorColumns(columnDefs) : []),
    [columnDefs]
  )

  const handleSort = (column: ColumnDef<T>, direction: TableSortDirection | undefined) => {
    if (!onSort || !getColumnSorted) return

    switch (direction) {
      case TableSortDirection.DESC:
        onSort(column, TableSortDirection.ASC)
        break
      case TableSortDirection.ASC:
        onSort(column, undefined)
        break
      default:
        onSort(column, TableSortDirection.DESC)
    }
  }

  const actionsCount = [onEdit, onDelete, actions].filter(Boolean).length
  const actionsWidth = actionsCount * 36 + (actionsCount - 1) * 4 + 48

  return (
    <Table
      {...tableProps}
      className={twMerge('relative', tableProps.className)}
    >
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader
        {...headerProps}
        className={cn('sticky top-0 z-50 shadow-sm', headerProps?.className)}
      >
        {Array.isArray(columnDefs)
          ? headerGroups.map((headerGroup, index) => (
              <GenericTableRow
                key={index}
                className="hover:bg-slate-100 border-t border-slate-200 bg-slate-100 even:bg-slate-100 even:hover:bg-slate-100"
              >
                {Array.isArray(headerGroup)
                  ? headerGroup.map((column) => {
                      const {
                        _colSpan,
                        _rowSpan,
                        key,
                        header,
                        renderHeader,
                        fit,
                        fill,
                        stretch,
                        numeric,
                        sort,
                        headerClassName,
                        width,
                        minWidth,
                        maxWidth
                      } = column
                      const sorted = getColumnSorted?.(column)
                      return (
                        <GenericTableHead
                          key={key.toString()}
                          numeric={numeric}
                          fit={fit}
                          fill={fill}
                          sort={column.sort}
                          stretch={stretch}
                          className={headerClassName}
                          colSpan={_colSpan}
                          rowSpan={_rowSpan}
                          style={{
                            width,
                            minWidth,
                            maxWidth
                          }}
                          onClick={column.sort ? () => handleSort(column, sorted) : undefined}
                        >
                          {renderHeader
                            ? renderHeader()
                            : !header
                              ? t(key.toString())
                              : typeof header === 'string'
                                ? t(header)
                                : header}
                          {sort ? (
                            <span className="inline-block ml-2.5 -my-10 size-5 align-middle">
                              {sorted === TableSortDirection.DESC ? (
                                <ArrowDown10 className="size-5 text-brand" />
                              ) : sorted === TableSortDirection.ASC ? (
                                <ArrowUp01 className="size-5 text-brand" />
                              ) : (
                                <ArrowDownNarrowWide className="size-5 text-slate-400" />
                              )}
                            </span>
                          ) : null}
                        </GenericTableHead>
                      )
                    })
                  : null}
                {onDelete || onEdit || actions ? (
                  <GenericTableHead
                    fit
                    className="text-center sticky right-0 z-10 !bg-inherit border-l"
                    key="actions"
                    style={{
                      width: actionsWidth,
                      minWidth: actionsWidth,
                      maxWidth: actionsWidth
                    }}
                  ></GenericTableHead>
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
                key={getRowKey(row)}
                onClick={() => onClickRow?.(row)}
                ref={(el) => {
                  if (activeRowId === getRowId(row)) {
                    setSelectedRowRef(el)
                  }
                }}
                className={cn(
                  'group',
                  activeRowId === getRowId(row) &&
                    'bg-slate-100 even:bg-slate-100 hover:bg-slate-100 hover:even:bg-slate-100 !border-t !font-bold transition-none',
                  disabledIds.includes(Number(getRowId(row))) && 'opacity-50 pointer-events-none',
                  selectedIds.includes(Number(getRowId(row))) &&
                    'bg-brand/5 even:bg-brand/5 hover:bg-brand/5 hover:even:bg-brand/5 border-brand/20 [&>td]:border-brand/20'
                )}
                data-selected={selectedIds.includes(Number(getRowId(row)))}
              >
                {Array.isArray(columnDefs)
                  ? accessorColumns.map((col) => {
                      const {
                        key,
                        fit,
                        fill,
                        stretch,
                        numeric,
                        renderCell,
                        className,
                        width,
                        minWidth,
                        maxWidth
                      } = col
                      return (
                        <GenericTableCell
                          key={key.toString()}
                          fit={fit}
                          fill={fill}
                          stretch={stretch}
                          numeric={numeric}
                          className={cn(
                            activeRowId === getRowId(row) && 'text-brand font-bold',
                            className
                          )}
                          style={{
                            width,
                            minWidth,
                            maxWidth
                          }}
                        >
                          {typeof renderCell === 'function'
                            ? renderCell(row, col, props)
                            : defaultCellRenderer(row, col)}
                        </GenericTableCell>
                      )
                    })
                  : null}

                {onDelete || onEdit || actions ? (
                  <GenericTableCell
                    className="py-1 sticky right-0 bg-inherit shadow-sm border-l"
                    style={{
                      width: actionsWidth,
                      minWidth: actionsWidth,
                      maxWidth: actionsWidth
                    }}
                  >
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
                      {actions?.(row)}
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

export const defaultCellRenderer = <T extends object>(row: T, col: ColumnDef<T>): ReactNode => {
  if (col.numeric) {
    return row[col.key as keyof T] ? formatNumber(Number(row[col.key as keyof T])) : '-'
  }
  return row[col.key as keyof T] ? String(row[col.key as keyof T]) : '-'
}
export const defaultGetRowId = <T,>(row: T): string => {
  if (row !== null && typeof row === 'object' && 'id' in row) {
    return String(row['id'])
  }
  return ''
}
