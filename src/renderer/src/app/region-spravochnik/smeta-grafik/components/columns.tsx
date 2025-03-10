import type { SmetaTableProps } from './table'
import type { SmetaGrafik } from '@/common/models'
import type { ComponentType } from 'react'

import { Copyable } from '@renderer/common/components'
import { DataList } from '@renderer/common/components/data-list'
import { HoverInfoCell } from '@renderer/common/components/table/renderers'
import { Pencil, Trash2 } from 'lucide-react'
import { Trans } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import { formatNumber } from '@/common/lib/format'

type ColumnDef = {
  alphanumeric?: boolean
  sticky?: true
  key: string
  header: string
  className?: string
  cellElement?: ComponentType<Pick<SmetaTableProps, 'onEdit' | 'onDelete'> & { row: SmetaGrafik }>
}

const columns: ColumnDef[] = [
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5',
    key: 'smeta_number',
    header: 'smeta_number',
    cellElement: ({ row }) => (
      <HoverInfoCell
        title={row.smeta_number}
        titleProps={{
          className: 'text-xs'
        }}
        hoverContent={
          <DataList
            className="font-normal text-sm"
            list={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.smeta_id}
                  >
                    #{row.smeta_id}
                  </Copyable>
                )
              },
              {
                name: <Trans>number</Trans>,
                value: row.smeta_number
              },
              {
                name: <Trans>name</Trans>,
                value: row.smeta_name
              }
            ]}
          />
        }
      />
    )
  },
  {
    alphanumeric: true,
    sticky: true,
    className: 'px-5',
    key: 'year',
    header: 'year'
  },
  {
    key: 'oy_1',
    header: 'january'
  },
  {
    key: 'oy_2',
    header: 'february'
  },
  {
    key: 'oy_3',
    header: 'march'
  },
  {
    sticky: true,
    key: 'itogo_1_kvartal',
    header: '1-kvartal',
    cellElement: ({ row }) => {
      return formatNumber(
        (['oy_1', 'oy_2', 'oy_3'] as const).reduce((acc, key) => {
          return acc + Number(row[key] || 0)
        }, 0)
      )
    }
  },
  {
    key: 'oy_4',
    header: 'Апрель'
  },
  {
    key: 'oy_5',
    header: 'Май'
  },
  {
    key: 'oy_6',
    header: 'Июнь'
  },
  {
    sticky: true,
    key: 'itogo_2_kvartal',
    header: '2-kvartal',
    cellElement: ({ row }) => {
      return formatNumber(
        (['oy_4', 'oy_5', 'oy_6'] as const).reduce((acc, key) => {
          return acc + Number(row[key] || 0)
        }, 0)
      )
    }
  },
  {
    key: 'oy_7',
    header: 'Июль'
  },
  {
    key: 'oy_8',
    header: 'Август'
  },
  {
    key: 'oy_9',
    header: 'Сентябрь'
  },
  {
    sticky: true,
    key: 'itogo_3_kvartal',
    header: '3-kvartal',
    cellElement: ({ row }) => {
      return formatNumber(
        (['oy_7', 'oy_8', 'oy_9'] as const).reduce((acc, key) => {
          return acc + Number(row[key] || 0)
        }, 0)
      )
    }
  },
  {
    key: 'oy_10',
    header: 'Октябрь'
  },
  {
    key: 'oy_11',
    header: 'Ноябрь'
  },
  {
    key: 'oy_12',
    header: 'Декабрь'
  },
  {
    sticky: true,
    key: 'itogo_4_kvartal',
    header: '4-kvartal',
    cellElement: ({ row }) => {
      return formatNumber(
        (['oy_10', 'oy_11', 'oy_12'] as const).reduce((acc, key) => {
          return acc + Number(row[key] || 0)
        }, 0)
      )
    }
  },
  {
    sticky: true,
    key: 'itogo',
    header: 'total'
  },
  {
    sticky: true,
    alphanumeric: true,
    key: 'actions',
    header: 'Действие',
    cellElement: ({ onEdit, onDelete, row }) => {
      return (
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
        </div>
      )
    }
  }
]

export { columns }
export type { ColumnDef }
