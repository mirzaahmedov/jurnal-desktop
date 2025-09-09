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
  onViewMatPomoch?: (row: MainZarplata) => void
}
export const MainZarplataTable = ({
  enableMatPomoch,
  data,
  onViewMatPomoch,
  ...props
}: MainZarplataTableProps) => {
  const onViewMatPomochCallback = useEventCallback(onViewMatPomoch)
  const columnDefs = useMemo(() => {
    if (enableMatPomoch) {
      return [
        ...MainZarplataColumnDefs,
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
        }
      ]
    }
    return MainZarplataColumnDefs
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
