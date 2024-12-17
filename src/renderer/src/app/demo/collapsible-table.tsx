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
import { smetaColumns } from '../super-admin/smeta'

type CollapsibleTableProps = {
  data: Smeta[]
}
const CollapsibleTable = ({ data }: CollapsibleTableProps) => {
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
        {Array.isArray(data) && data.length ? (
          data
            .filter((row) => {
              console.log(row.father_smeta_name)
              return row.father_smeta_name === 'Асосий'
            })
            .map((row) => (
              <Collapsible key={row.id} asChild>
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
                              ? renderCell(row, col)
                              : row[col.key as keyof Smeta]}
                          </GenericTableCell>
                        )
                      })}
                    </GenericTableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))
        ) : (
          <GenericTableRow className="pointer-events-none">
            <GenericTableCell colSpan={100} className="w-full text-center py-20 text-slate-400">
              {'Нет данных для отображения'}
            </GenericTableCell>
          </GenericTableRow>
        )}
      </TableBody>
    </Table>
  )
}

export { CollapsibleTable }
