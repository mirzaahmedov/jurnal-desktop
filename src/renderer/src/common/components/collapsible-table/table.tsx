import type { ColumnDef } from './types'

import { type ReactNode } from 'react'

import {
  GenericTableCell,
  GenericTableHead,
  GenericTableRow
} from '@renderer/common/components/generic-table'
import { Button } from '@renderer/common/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/common/components/ui/collapsible'
import { Table, TableBody, TableHeader } from '@renderer/common/components/ui/table'
import { cn } from '@renderer/common/lib/utils'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyList } from '../empty-states'

export type CollapsibleTableProps<T extends object, C extends object> = {
  displayHeader?: boolean
  data: T[]
  columnDefs: ColumnDef<NoInfer<T>>[]
  width?: number
  disabledIds?: number[]
  selectedId?: number
  getRowId: (row: T) => number | string
  getChildRows: (row: T) => C[] | undefined
  renderChildRows?: (rows: NoInfer<C>[]) => ReactNode
  onClickRow?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}
export const CollapsibleTable = <T extends object, C extends object = T>({
  displayHeader = true,
  data,
  columnDefs,
  width,
  disabledIds,
  selectedId,
  getRowId,
  getChildRows,
  renderChildRows,
  onClickRow,
  onEdit,
  onDelete
}: CollapsibleTableProps<T, C>) => {
  const { t } = useTranslation()
  return (
    <Table style={{ width }}>
      {displayHeader ? (
        <TableHeader className="sticky top-0 z-50">
          <GenericTableRow className="bg-slate-100 hover:bg-slate-100 border-t border-slate-200">
            {columnDefs.map((col) => {
              const { key, header, fit, stretch, numeric, headerClassName, width } = col
              return (
                <GenericTableHead
                  key={key.toString()}
                  numeric={numeric}
                  fit={fit}
                  stretch={stretch}
                  className={headerClassName}
                  style={{ width }}
                >
                  {typeof header === 'string' ? t(header) : !header ? t(key.toString()) : header}
                </GenericTableHead>
              )
            })}
            {onEdit || onDelete ? (
              <GenericTableHead
                key="actions"
                className="w-32"
              >
                {t('actions')}
              </GenericTableHead>
            ) : null}
          </GenericTableRow>
        </TableHeader>
      ) : null}

      <TableBody>
        {Array.isArray(data) && data.length ? (
          data.map((row) => (
            <CollapsibleItem
              key={getRowId(row)}
              row={row}
              tableProps={{
                columnDefs,
                getRowId,
                getChildRows,
                renderChildRows,
                onClickRow,
                onEdit,
                onDelete,
                disabledIds,
                selectedId,
                data
              }}
            />
          ))
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
              ></EmptyList>
            </GenericTableCell>
          </GenericTableRow>
        )}
      </TableBody>
    </Table>
  )
}

type CollapsibleItemProps<T extends object, C extends object> = {
  row: T
  tableProps: CollapsibleTableProps<T, C>
  level?: number
}
const CollapsibleItem = <T extends object, C extends object>({
  row,
  tableProps,
  level = 1
}: CollapsibleItemProps<T, C>) => {
  const {
    columnDefs,
    getRowId,
    getChildRows,
    renderChildRows,
    onClickRow,
    onEdit,
    onDelete,
    disabledIds,
    selectedId,
    width
  } = tableProps

  if (!Array.isArray(getChildRows(row))) {
    return (
      <GenericTableRow
        key={getRowId(row)}
        className={cn(
          'even:bg-transparent even:hover:bg-transparent odd:bg-transparent hover:bg-transparent',
          disabledIds?.includes(Number(getRowId(row))) && 'opacity-50 pointer-events-none'
        )}
        onClick={() => onClickRow?.(row)}
        data-selected={selectedId === Number(getRowId(row))}
      >
        {columnDefs.map((col) => {
          const { key, fit, stretch, numeric, renderCell, width } = col
          return (
            <GenericTableCell
              key={key.toString()}
              fit={fit}
              stretch={stretch}
              numeric={numeric}
              className={col.className}
              style={{ width }}
            >
              {typeof renderCell === 'function'
                ? renderCell(row, col)
                : String(row?.[col?.key as keyof T])}
            </GenericTableCell>
          )
        })}
        {onEdit || onDelete ? (
          <GenericTableCell className="py-1 w-32">
            <div className="flex items-center whitespace-nowrap w-full gap-1">
              {onEdit ? (
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
              ) : null}
              {onDelete ? (
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
              ) : null}
            </div>
          </GenericTableCell>
        ) : null}
      </GenericTableRow>
    )
  }

  return (
    <Collapsible
      key={getRowId(row)}
      asChild
    >
      <>
        <GenericTableRow onClick={() => onClickRow?.(row)}>
          {columnDefs.map((col, index) => {
            const { key, fit, stretch, numeric, renderCell, width } = col
            return (
              <GenericTableCell
                key={key.toString()}
                fit={fit}
                stretch={stretch}
                numeric={numeric}
                className={cn('font-bold', index === 0 && 'flex items-center', col.className)}
                style={{ width }}
              >
                {index === 0 && (
                  <CollapsibleTrigger
                    asChild
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-6 align-middle mr-2"
                    >
                      <Plus className="btn-icon !size-3.5 !ml-0" />
                    </Button>
                  </CollapsibleTrigger>
                )}
                {typeof renderCell === 'function'
                  ? renderCell(row, col)
                  : String(row?.[col?.key as keyof T] ?? '')}
              </GenericTableCell>
            )
          })}
          {onEdit || onDelete ? (
            <GenericTableCell className="py-1 w-32">
              <div className="flex items-center whitespace-nowrap w-full gap-1">
                {onEdit ? (
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
                ) : null}
                {onDelete ? (
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
                ) : null}
              </div>
            </GenericTableCell>
          ) : null}
        </GenericTableRow>
        <CollapsibleContent asChild>
          <GenericTableRow>
            <GenericTableCell
              colSpan={100}
              className="p-0 bg-white"
            >
              {typeof renderChildRows === 'function' ? (
                renderChildRows(getChildRows(row)!)
              ) : (
                <div
                  className="pl-14"
                  style={{ width }}
                >
                  <Table className="overflow-hidden">
                    <TableBody>
                      {getChildRows(row)!.map((child) => (
                        <CollapsibleItem
                          key={getRowId(row)}
                          row={child}
                          tableProps={tableProps as unknown as CollapsibleTableProps<C, C>}
                          level={level + 1}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </GenericTableCell>
          </GenericTableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  )
}
