import type { RasxodFormValues, RasxodProvodkaFormValues } from '../config'
import type { UseFormReturn } from 'react-hook-form'

import { EditableTableHead, EditableTableRow } from '@renderer/common/components/editable-table'
import { Table, TableBody, TableHeader } from '@renderer/common/components/ui/table'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Trans } from 'react-i18next'

type ProvodkaProps = {
  form: UseFormReturn<RasxodFormValues>
  tabIndex: number
}
export const Provodka = ({ form, tabIndex }: ProvodkaProps) => {
  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: []
  })
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <EditableTableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const columnRelativeDepth = header.depth - header.column.depth

              if (columnRelativeDepth > 1) {
                return null
              }

              let rowSpan = 1
              if (header.isPlaceholder) {
                const leafs = header.getLeafHeaders()
                rowSpan = leafs[leafs.length - 1].depth - header.depth
              }
              return (
                <EditableTableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  rowSpan={rowSpan}
                  style={{ width: header.getSize() }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </EditableTableHead>
              )
            })}
          </EditableTableRow>
        ))}
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  )
}

const columns: ColumnDef<RasxodProvodkaFormValues>[] = [
  {
    accessorKey: 'naimenovanie_tovarov_jur7_id',
    header: () => <Trans>code</Trans>
  },
  {
    accessorKey: 'name',
    header: () => <Trans>name</Trans>,
    size: 400,
    minSize: 400
  },
  {
    accessorKey: 'group_number',
    header: () => <Trans>group</Trans>
  },
  {
    accessorKey: 'edin',
    header: () => <Trans>ei</Trans>
  },
  {
    accessorKey: 'serial_num',
    header: () => <Trans>serial-num</Trans>
  },
  {
    accessorKey: 'inventar_num',
    header: () => <Trans>inventar-num</Trans>
  },
  {
    accessorKey: 'kol',
    header: () => <Trans>kol</Trans>
  },
  {
    accessorKey: 'sena',
    header: () => <Trans>sena</Trans>
  },
  {
    accessorKey: 'summa',
    header: () => <Trans>summa</Trans>
  },
  {
    accessorKey: 'iznos',
    header: () => <Trans>iznos</Trans>
  },
  {
    id: 'debet',
    header: () => <Trans>debet</Trans>,
    columns: [
      {
        accessorKey: 'debet_schet',
        header: () => <Trans>schet</Trans>
      },
      {
        accessorKey: 'debet_sub_schet',
        header: () => <Trans>subschet</Trans>
      }
    ]
  },
  {
    id: 'kredit',
    header: () => <Trans>kredit</Trans>,
    columns: [
      {
        accessorKey: 'kredit_schet',
        header: () => <Trans>schet</Trans>
      },
      {
        accessorKey: 'kredit_sub_schet',
        header: () => <Trans>subschet</Trans>
      }
    ]
  },
  {
    id: 'iznos',
    header: () => <Trans>iznos</Trans>,
    columns: [
      {
        accessorKey: 'iznos_schet',
        header: () => <Trans>schet</Trans>
      },
      {
        accessorKey: 'iznos_sub_schet',
        header: () => <Trans>subschet</Trans>
      }
    ]
  }
]
