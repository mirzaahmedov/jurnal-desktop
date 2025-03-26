import type { PrixodFormValues, PrixodProvodkaFormValues } from '../config'

import { useRef } from 'react'

import { createGroupSpravochnik } from '@renderer/app/super-admin/group/service'
import { NumericInput } from '@renderer/common/components'
import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import { Input } from '@renderer/common/components/ui/input'
import { Table, TableBody, TableHeader } from '@renderer/common/components/ui/table'
import { inputVariants, useSpravochnik } from '@renderer/common/features/spravochnik'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { Trans } from 'react-i18next'

type ProvodkaProps = {
  form: UseFormReturn<PrixodFormValues>
  tabIndex: number
}
export const Provodka = ({ form }: ProvodkaProps) => {
  const tableRef = useRef<HTMLDivElement>(null)

  const { fields } = useFieldArray({
    control: form.control,
    name: 'childs'
  })

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: fields,
    meta: {
      form
    }
  })

  const { rows } = table.getRowModel()
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 42,
    getScrollElement: () => tableRef.current,
    overscan: 42
  })

  return (
    <div
      ref={tableRef}
      className="h-[600px] overflow-auto scrollbar p-1"
    >
      <Table className="border-separate border-spacing-0">
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
                    className="border-b"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </EditableTableHead>
                )
              })}
            </EditableTableRow>
          ))}
        </TableHeader>
        <TableBody>
          {virtualizer.getVirtualItems().map((virtualRow, index) => {
            const row = rows[virtualRow.index]
            return (
              <EditableTableRow
                key={row.id}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
                }}
                className="p-1"
              >
                {row.getVisibleCells().map((cell) => (
                  <EditableTableCell
                    key={cell.id}
                    className="border-b p-px"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </EditableTableCell>
                ))}
              </EditableTableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

interface TableMeta {
  form: UseFormReturn<PrixodFormValues>
}

const columns: ColumnDef<PrixodProvodkaFormValues>[] = [
  {
    accessorKey: 'group_number',
    header: () => <Trans>group</Trans>,
    cell: ({ table, row }) => {
      const meta = (table.options.meta as TableMeta) ?? {}
      const field = meta?.form?.register?.(`childs.${row.index}.group_number`)

      const groupSpravochnik = useSpravochnik(
        createGroupSpravochnik({
          value: meta?.form?.watch(`childs.${row.index}.group_jur7_id`),
          onChange: (_, group) => {
            meta?.form?.setValue(`childs.${row.index}.group_jur7_id`, group!.id)
            meta?.form?.setValue(`childs.${row.index}.group_number`, group!.group_number)
          }
        })
      )

      return (
        <Input
          readOnly
          className={inputVariants({
            editor: true
          })}
          {...field}
          onChange={undefined}
          onDoubleClick={groupSpravochnik.open}
        />
      )
    }
  },
  {
    accessorKey: 'name',
    header: () => <Trans>name</Trans>,
    size: 400,
    minSize: 400,
    cell: ({ table, row }) => {
      const meta = (table.options.meta as TableMeta) ?? {}
      const field = meta?.form?.register?.(`childs.${row.index}.name`)

      return (
        <Input
          readOnly
          className={inputVariants({
            editor: true
          })}
          {...field}
        />
      )
    }
  },
  {
    accessorKey: 'edin',
    header: () => <Trans>ei</Trans>,
    cell: ({ table, row }) => {
      const meta = (table.options.meta as TableMeta) ?? {}
      const field = meta?.form?.register?.(`childs.${row.index}.edin`)

      return (
        <Input
          readOnly
          className={inputVariants({
            editor: true
          })}
          {...field}
        />
      )
    }
  },
  {
    accessorKey: 'serial_num',
    header: () => <Trans>serial-num</Trans>,
    cell: ({ table, row }) => {
      const meta = (table.options.meta as TableMeta) ?? {}
      const field = meta?.form?.register?.(`childs.${row.index}.serial_num`)

      return (
        <Input
          readOnly
          className={inputVariants({
            editor: true
          })}
          {...field}
        />
      )
    }
  },
  {
    accessorKey: 'inventar_num',
    header: () => <Trans>inventar-num</Trans>,
    cell: ({ table, row }) => {
      const meta = (table.options.meta as TableMeta) ?? {}
      const field = meta?.form?.register?.(`childs.${row.index}.inventar_num`)

      return (
        <Input
          readOnly
          className={inputVariants({
            editor: true
          })}
          {...field}
        />
      )
    }
  },
  {
    accessorKey: 'kol',
    header: () => <Trans>kol</Trans>,
    cell: ({ table, row }) => {
      const meta = (table.options.meta as TableMeta) ?? {}
      const field = meta?.form?.register?.(`childs.${row.index}.kol`)

      return (
        <NumericInput
          readOnly
          className={inputVariants({
            editor: true
          })}
          {...field}
        />
      )
    }
  },
  {
    accessorKey: 'sena',
    header: () => <Trans>sena</Trans>,
    cell: ({ table, row }) => {
      const meta = (table.options.meta as TableMeta) ?? {}
      const field = meta?.form?.register?.(`childs.${row.index}.sena`)

      return (
        <NumericInput
          readOnly
          className={inputVariants({
            editor: true
          })}
          {...field}
        />
      )
    }
  },
  {
    accessorKey: 'summa',
    header: () => <Trans>summa</Trans>,
    cell: ({ table, row }) => {
      const meta = (table.options.meta as TableMeta) ?? {}
      const field = meta?.form?.register?.(`childs.${row.index}.summa`)

      return (
        <NumericInput
          readOnly
          className={inputVariants({
            editor: true
          })}
          {...field}
        />
      )
    }
  },
  {
    id: 'iznos',
    header: () => <Trans>iznos</Trans>,
    columns: [
      {
        accessorKey: 'iznos',
        header: () => <Trans>iznos</Trans>,
        cell: ({ table, row }) => {
          const meta = (table.options.meta as TableMeta) ?? {}
          const field = meta?.form?.register?.(`childs.${row.index}.iznos`)

          return (
            <div className="px-3 flex items-center">
              <Checkbox
                className="size-5"
                {...field}
              />
            </div>
          )
        }
      },
      {
        accessorKey: 'eski_iznos_summa',
        size: 400,
        minSize: 400,
        header: () => <Trans>iznos_summa_old</Trans>,
        cell: ({ table, row }) => {
          const meta = (table.options.meta as TableMeta) ?? {}
          const field = meta?.form?.register?.(`childs.${row.index}.eski_iznos_summa`)

          return (
            <NumericInput
              readOnly
              className={inputVariants({
                editor: true
              })}
              {...field}
            />
          )
        }
      },
      {
        accessorKey: 'iznos_schet',
        header: () => <Trans>schet</Trans>,
        cell: ({ table, row }) => {
          const meta = (table.options.meta as TableMeta) ?? {}
          const field = meta?.form?.register?.(`childs.${row.index}.iznos_schet`)

          return (
            <Input
              readOnly
              className={inputVariants({
                editor: true
              })}
              {...field}
            />
          )
        }
      },
      {
        accessorKey: 'iznos_sub_schet',
        header: () => <Trans>subschet</Trans>,
        cell: ({ table, row }) => {
          const meta = (table.options.meta as TableMeta) ?? {}
          const field = meta?.form?.register?.(`childs.${row.index}.iznos_sub_schet`)

          return (
            <Input
              readOnly
              className={inputVariants({
                editor: true
              })}
              {...field}
            />
          )
        }
      }
    ]
  },
  {
    id: 'debet',
    header: () => <Trans>debet</Trans>,
    columns: [
      {
        accessorKey: 'debet_schet',
        header: () => <Trans>schet</Trans>,
        cell: ({ table, row }) => {
          const meta = (table.options.meta as TableMeta) ?? {}
          const field = meta?.form?.register?.(`childs.${row.index}.debet_schet`)

          return (
            <Input
              readOnly
              className={inputVariants({
                editor: true
              })}
              {...field}
            />
          )
        }
      },
      {
        accessorKey: 'debet_sub_schet',
        header: () => <Trans>subschet</Trans>,
        cell: ({ table, row }) => {
          const meta = (table.options.meta as TableMeta) ?? {}
          const field = meta?.form?.register?.(`childs.${row.index}.debet_sub_schet`)

          return (
            <Input
              readOnly
              className={inputVariants({
                editor: true
              })}
              {...field}
            />
          )
        }
      }
    ]
  },
  {
    id: 'kredit',
    header: () => <Trans>kredit</Trans>,
    columns: [
      {
        accessorKey: 'kredit_schet',
        header: () => <Trans>schet</Trans>,
        cell: ({ table, row }) => {
          const meta = (table.options.meta as TableMeta) ?? {}
          const field = meta?.form?.register?.(`childs.${row.index}.kredit_schet`)

          return (
            <Input
              readOnly
              className={inputVariants({
                editor: true
              })}
              {...field}
            />
          )
        }
      },
      {
        accessorKey: 'kredit_sub_schet',
        header: () => <Trans>subschet</Trans>,
        cell: ({ table, row }) => {
          const meta = (table.options.meta as TableMeta) ?? {}
          const field = meta?.form?.register?.(`childs.${row.index}.kredit_sub_schet`)

          return (
            <Input
              readOnly
              className={inputVariants({
                editor: true
              })}
              {...field}
            />
          )
        }
      }
    ]
  }
]
