import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/common/components/ui/collapsible'
import {
  GenericTableCell,
  GenericTableHead,
  GenericTableRow
} from '@/common/components/generic-table'
import { Table, TableBody, TableHeader } from '@renderer/common/components/ui/table'

import type { ColumnDef } from './types'
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
                <CollapsibleTrigger
                  asChild
                  onDoubleClick={() => {
                    onClickRow?.(row)
                  }}
                >
                  <GenericTableRow>
                    {columns.map((col) => {
                      const { key, fit, stretch, numeric, renderCell } = col
                      return (
                        <GenericTableCell
                          key={key.toString()}
                          fit={fit}
                          stretch={stretch}
                          numeric={numeric}
                          className="font-bold"
                        >
                          {typeof renderCell === 'function'
                            ? renderCell(row, col)
                            : String(row[col.key as keyof T])}
                        </GenericTableCell>
                      )
                    })}
                  </GenericTableRow>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <GenericTableRow>
                    <GenericTableCell
                      colSpan={100}
                      className="p-0"
                    >
                      <div className="pl-[60px] bg-white">
                        <Table className="">
                          <TableBody>
                            {row.children.map((child) => (
                              <GenericTableRow
                                key={child.id}
                                className={cn(styles.Nested_row, 'even:bg-transparent')}
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
