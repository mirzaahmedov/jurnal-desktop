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

import { Smeta } from '@renderer/common/models'
import { cn } from '@renderer/common/lib/utils'
import { groupNestedList } from './utils'
import { smetaColumns } from '../super-admin/smeta'
import styles from './styles.module.css'
import { useMemo } from 'react'

type CollapsibleTableProps = {
  data: Smeta[]
}
const CollapsibleTable = ({ data }: CollapsibleTableProps) => {
  const nested = useMemo(() => groupNestedList(data, 'father_smeta_name'), [data])

  return (
    <Table>
      <TableHeader>
        <GenericTableRow className="hover:bg-transparent border-t border-slate-200">
          {smetaColumns.map((col) => {
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
        {Array.isArray(nested) && nested.length ? (
          nested.map((row) => (
            <Collapsible
              key={row.id}
              asChild
            >
              <>
                <CollapsibleTrigger asChild>
                  <GenericTableRow>
                    {smetaColumns.map((col) => {
                      const { key, fit, stretch, numeric, renderCell } = col
                      return (
                        <GenericTableCell
                          key={key.toString()}
                          fit={fit}
                          stretch={stretch}
                          numeric={numeric}
                          className={cn(
                            Array.isArray(row.children) && row.children.length > 0 && 'font-bold'
                          )}
                        >
                          {typeof renderCell === 'function'
                            ? renderCell(row, col)
                            : row[col.key as keyof Smeta]}
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
                              >
                                {smetaColumns.map((col) => {
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
                                        : child[col.key as keyof Smeta]}
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
