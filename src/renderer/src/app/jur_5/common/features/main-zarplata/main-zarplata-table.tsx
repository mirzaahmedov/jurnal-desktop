import type { MainZarplata } from '@/common/models'

import { useMemo } from 'react'

import { t } from 'i18next'
import { Eye } from 'lucide-react'

import { GenericTable, type GenericTableProps } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useEventCallback } from '@/common/hooks'

import { MainZarplataColumnDefs } from './columns'

export interface MainZarplataTableProps extends Partial<GenericTableProps<MainZarplata>> {
  enableMatPomoch?: boolean
  enableTabel?: boolean
  onViewMatPomoch?: (row: MainZarplata) => void
}
export const MainZarplataTable = ({
  data,
  enableMatPomoch,
  enableTabel,
  onViewMatPomoch,
  ...props
}: MainZarplataTableProps) => {
  const onViewMatPomochCallback = useEventCallback(onViewMatPomoch)
  const columnDefs = useMemo(() => {
    const columns = [...MainZarplataColumnDefs]
    if (enableMatPomoch) {
      columns.push(
        ...[
          {
            key: 'isMatPomoch',
            header: 'have_taken_material_help',
            renderCell: (row) => (
              <div className="flex items-center gap-2.5">
                {row.isMatPomoch ? (
                  <span className="font-bold text-emerald-500">{t('yes')}</span>
                ) : (
                  <span className="font-bold text-red-500">{t('no')}</span>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onViewMatPomochCallback?.(row)}
                  className="size-8"
                >
                  <Eye className="btn-icon" />
                </Button>
              </div>
            )
          },
          {
            key: 'isPremya',
            header: 'dont_give_premya',
            renderCell: (row) =>
              row.isPremya ? (
                <span className="font-bold text-red-500">{t('dont_give_premya')}</span>
              ) : (
                <span className="font-bold text-emerald-500"></span>
              )
          }
        ]
      )
    }
    if (enableTabel) {
      columns.push({
        key: 'isRaschet',
        header: 'has_gotten_payroll',
        renderCell: (row) =>
          row.isRaschet ? (
            <span className="font-bold text-emerald-500">{t('yes')}</span>
          ) : (
            <span className="font-bold text-red-500">{t('no')}</span>
          )
      })
    }
    return columns
  }, [enableMatPomoch, onViewMatPomochCallback])
  return (
    <GenericTable
      columnDefs={columnDefs}
      className="table-generic-xs"
      data={data ?? []}
      {...props}
    />
  )
}
