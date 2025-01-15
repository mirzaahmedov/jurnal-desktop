import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/common/components/ui/collapsible'
import {
  GenericTableCell,
  GenericTableHead,
  GenericTableRow
} from '@renderer/common/components/generic-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Table, TableBody, TableHeader } from '@renderer/common/components/ui/table'

import { Button } from '@renderer/common/components/ui/button'
import type { ColumnDef } from './types'
import { cn } from '@renderer/common/lib/utils'

export type CollapsibleTableProps<T> = {
  data: T[]
  columns: ColumnDef<Partial<T>>[]
  onClickRow?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}
const CollapsibleTable = <T extends { id: number; children: T[] }>({
  data,
  columns,
  onClickRow,
  onEdit,
  onDelete
}: CollapsibleTableProps<T>) => {
  return (
    <Table>
      <TableHeader>
        <GenericTableRow className="hover:bg-transparent border-t border-slate-200">
          {columns.map((col) => {
            const { key, header, fit, stretch, numeric, headerClassName } = col
            return (
              <GenericTableHead
                key={key.toString()}
                numeric={numeric}
                fit={fit}
                stretch={stretch}
                className={headerClassName}
              >
                {header}
              </GenericTableHead>
            )
          })}
          {onEdit || onDelete ? (
            <GenericTableHead
              key="actions"
              className="w-32"
            >
              Действия
            </GenericTableHead>
          ) : null}
        </GenericTableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(data) && data.length ? (
          data.map((row) => (
            <CollapsibleItem
              key={row.id}
              row={row}
              tableProps={{ columns, onClickRow, onEdit, onDelete, data }}
            />
          ))
        ) : (
          <GenericTableRow className="pointer-events-none">
            <GenericTableCell
              colSpan={100}
              className="w-full text-center py-20 text-slate-400"
            >
              Нет данных для отображения
            </GenericTableCell>
          </GenericTableRow>
        )}
      </TableBody>
    </Table>
  )
}

type CollapsibleItemProps<T> = {
  row: T
  tableProps: CollapsibleTableProps<T>
}
const CollapsibleItem = <T extends { id: number; children: T[] }>({
  row,
  tableProps
}: CollapsibleItemProps<T>) => {
  const { columns, onClickRow, onEdit, onDelete } = tableProps

  if (!row.children?.length) {
    return (
      <GenericTableRow
        key={row.id}
        className={cn(
          'even:bg-transparent even:hover:bg-transparent odd:bg-transparent hover:bg-transparent'
        )}
        onClick={() => onClickRow?.(row)}
      >
        {columns.map((col) => {
          const { key, fit, stretch, numeric, renderCell } = col
          return (
            <GenericTableCell
              key={key.toString()}
              fit={fit}
              stretch={stretch}
              numeric={numeric}
              className={col.className}
            >
              {typeof renderCell === 'function'
                ? renderCell(row, col)
                : String(row[col.key as keyof T])}
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
      key={row.id}
      asChild
    >
      <>
        <GenericTableRow onClick={() => onClickRow?.(row)}>
          {columns.map((col, index) => {
            const { key, fit, stretch, numeric, renderCell } = col
            return (
              <GenericTableCell
                key={key.toString()}
                fit={fit}
                stretch={stretch}
                numeric={numeric}
                className={cn('font-bold', col.className)}
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
                  : String(row[col.key as keyof T])}
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
              className="p-0"
            >
              <div className="pl-[60px] bg-white">
                <Table>
                  <TableBody>
                    {row.children.map((child) => (
                      <CollapsibleItem
                        key={child.id}
                        row={child}
                        tableProps={tableProps}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </GenericTableCell>
          </GenericTableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  )
}

export { CollapsibleTable }
