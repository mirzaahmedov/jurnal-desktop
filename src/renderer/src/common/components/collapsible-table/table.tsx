import type { CollapsibleTableProps } from './interfaces'

import { CaretDownIcon } from '@radix-ui/react-icons'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  GenericTableCell,
  GenericTableHead,
  GenericTableRow
} from '@/common/components/generic-table'
import { Button } from '@/common/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/common/components/ui/collapsible'
import { Table, TableBody, TableHeader } from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'

import { EmptyList } from '../empty-states'

export const CollapsibleTable = <T extends object, C extends object = T>({
  displayHeader = true,
  data,
  columnDefs,
  width,
  disabledIds,
  selectedIds,
  className,
  params,
  getRowId,
  getRowKey,
  getRowSelected,
  children,
  getChildRows,
  onClickRow,
  onEdit,
  onDelete,
  classNames,
  openRows,
  onOpenRowsChange
}: CollapsibleTableProps<T, C>) => {
  const { t } = useTranslation()
  return (
    <Table
      style={{ width }}
      className={className}
    >
      {displayHeader ? (
        <TableHeader className={cn('sticky top-0 z-50 shadow-sm', classNames?.header)}>
          <GenericTableRow className="bg-slate-100 hover:bg-slate-100 border-t border-slate-200">
            {columnDefs.map((col) => {
              const { key, header, fit, stretch, numeric, headerClassName, width, renderHeader } =
                col
              return (
                <GenericTableHead
                  key={key.toString()}
                  numeric={numeric}
                  fit={fit}
                  stretch={stretch}
                  className={headerClassName}
                  style={{ width }}
                >
                  {renderHeader
                    ? renderHeader()
                    : typeof header === 'string'
                      ? t(header)
                      : !header
                        ? t(key.toString())
                        : header}
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
          data.map((row, rowIndex) => (
            <CollapsibleItem
              key={getRowKey ? getRowKey(row, rowIndex) : getRowId(row)}
              row={row}
              tableProps={{
                columnDefs,
                disabledIds,
                selectedIds,
                data,
                params,
                getRowId,
                getRowKey,
                getRowSelected,
                children,
                getChildRows,
                onClickRow,
                onEdit,
                onDelete,
                openRows,
                onOpenRowsChange
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

interface CollapsibleItemProps<T extends object, C extends object> {
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
    children,
    onClickRow,
    onEdit,
    onDelete,
    disabledIds,
    selectedIds,
    width,
    openRows,
    onOpenRowsChange
  } = tableProps

  if (!children && !getChildRows(row)?.length) {
    return (
      <GenericTableRow
        key={getRowId(row)}
        className={cn(
          'even:bg-transparent even:hover:bg-transparent odd:bg-transparent hover:bg-transparent',
          disabledIds?.includes(Number(getRowId(row))) && 'opacity-50 pointer-events-none'
        )}
        onClick={() => onClickRow?.(row)}
        data-selected={selectedIds?.includes(Number(getRowId(row)))}
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
                ? // Todo fis this type
                  renderCell(row, col, tableProps)
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
    )
  }

  return (
    <Collapsible
      key={getRowId(row)}
      open={openRows?.includes(getRowId(row))}
      onOpenChange={(open) => {
        if (!openRows) return
        if (open) {
          onOpenRowsChange?.(openRows?.concat(getRowId(row)))
        } else {
          onOpenRowsChange?.(openRows?.filter((id) => id !== getRowId(row)))
        }
      }}
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
                className={cn('font-bold', col.className)}
                style={{ width }}
              >
                {index === 0 ? (
                  <div className="flex items-center">
                    <CollapsibleTrigger
                      asChild
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Button
                        size="icon"
                        variant="outline"
                        className="flex-shrink-0 size-6 align-middle mr-4"
                      >
                        <CaretDownIcon className="btn-icon !size-3.5 !ml-0" />
                      </Button>
                    </CollapsibleTrigger>
                    {typeof renderCell === 'function'
                      ? renderCell(row, col, tableProps)
                      : String(row?.[col?.key as keyof T] ?? '')}
                  </div>
                ) : (
                  <>
                    {typeof renderCell === 'function'
                      ? renderCell(row, col, tableProps)
                      : String(row?.[col?.key as keyof T] ?? '')}
                  </>
                )}
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
        {children || getChildRows ? (
          <CollapsibleContent asChild>
            <GenericTableRow>
              <GenericTableCell
                colSpan={100}
                className="!p-0 last:border-r-0 bg-white"
              >
                {children ? (
                  children({
                    row,
                    tableProps
                  })
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
        ) : null}
      </>
    </Collapsible>
  )
}
