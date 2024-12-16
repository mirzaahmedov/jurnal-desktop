import type { ComponentType } from 'react'
import type { SmetaTableProps } from './table'
import type { SmetaGrafik } from '@/common/models'

import { Pencil, Trash2 } from 'lucide-react'
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
    header: 'Смета №'
  },
  {
    key: 'oy_1',
    header: 'Январь'
  },
  {
    key: 'oy_2',
    header: 'Февраль'
  },
  {
    key: 'oy_3',
    header: 'Март'
  },
  {
    sticky: true,
    key: 'itogo_1_kvartal',
    header: '1 квартал',
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
    header: '2 квартал',
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
    header: '3 квартал',
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
    header: '4 квартал',
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
    header: 'Итого'
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
