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
import { Table, TableBody, TableHeader } from '@renderer/common/components/ui/table'

import { Button } from '@renderer/common/components/ui/button'
import type { ColumnDef } from './types'
import { Plus } from 'lucide-react'
import { cn } from '@renderer/common/lib/utils'
import styles from './styles.module.css'

type CollapsibleTableProps<T> = {
  data: T[]
  columns: ColumnDef<Partial<T>>[]
  onClickRow?: (row: T) => void
}
const CollapsibleTable = <T extends { id: number; children: T[] }>({
  data,
  columns,
  onClickRow
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
        </GenericTableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(data) && data.length ? (
          data.map((row) => (
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
                              <GenericTableRow
                                key={child.id}
                                className={cn(
                                  styles.Nested_row,
                                  'even:bg-transparent even:hover:bg-transparent odd:bg-transparent hover:bg-transparent'
                                )}
                                onClick={() => onClickRow?.(child)}
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
                                        ? renderCell(child, col)
                                        : String(child[col.key as keyof T])}
                                    </GenericTableCell>
                                  )
                                })}
                              </GenericTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </GenericTableCell>
                  </GenericTableRow>
                </CollapsibleContent>
              </>
            </Collapsible>
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

export { CollapsibleTable }
