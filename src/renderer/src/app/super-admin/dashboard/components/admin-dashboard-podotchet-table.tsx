import type { AdminDashboardPodotchet } from '../model'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card'

import { AdminDashboardService } from '../service'

export interface AdminDashboardPodotchetTableProps {
  date?: string
  region_id?: number
  budjet_id?: number
}
export const AdminDashboardPodotchetTable = ({
  date,
  region_id,
  budjet_id
}: AdminDashboardPodotchetTableProps) => {
  const { t } = useTranslation()

  const [podotchets, setPodotchets] = useState<AdminDashboardPodotchet[]>()

  const podotchetsQuery = useQuery({
    queryKey: [
      AdminDashboardService.QueryKeys.Podotchets,
      {
        to: date!,
        region_id: region_id!,
        budjet_id: budjet_id!
      }
    ],
    queryFn: AdminDashboardService.getPodotchets,
    enabled: !!date
  })

  return (
    <>
      <Card className="relative">
        <CardHeader className="py-3">
          <CardTitle className="text-base">{t('podotchet-litso')}</CardTitle>
        </CardHeader>
        {podotchetsQuery.isFetching ? <LoadingOverlay /> : null}
        <CardContent className="p-0 max-h-[400px] overflow-x-auto scrollbar">
          <GenericTable
            columnDefs={[
              {
                minWidth: 500,
                key: 'name'
              },
              {
                minWidth: 300,
                key: 'summa',
                renderCell: (row) => <SummaCell summa={row.summa ?? 0} />
              }
            ]}
            data={podotchetsQuery.data?.data ?? []}
            className="table-generic-xs"
            onClickRow={(row) => setPodotchets(row.podotchets)}
          />
        </CardContent>
      </Card>

      <DialogTrigger
        isOpen={!!podotchets}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPodotchets(undefined)
          }
        }}
      >
        <DialogOverlay>
          <DialogContent className="w-full max-w-9xl h-full max-h-[800px]">
            <DialogHeader>
              <DialogTitle>{t('podotchet-litso')}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto scrollbar">
              <GenericTable
                columnDefs={[
                  {
                    key: 'name'
                  },
                  {
                    key: 'rayon'
                  },
                  {
                    key: 'position',
                    header: 'doljnost'
                  },
                  {
                    key: 'rank',
                    header: 'military_rank'
                  },
                  {
                    key: 'prixod',
                    renderCell: (row) => <SummaCell summa={row.summa.prixod_sum} />
                  },
                  {
                    key: 'rasxod',
                    renderCell: (row) => <SummaCell summa={row.summa.rasxod_sum} />
                  },
                  {
                    key: 'summa',
                    renderCell: (row) => <SummaCell summa={row.summa.summa} />
                  }
                ]}
                data={podotchets ?? []}
                className="table-generic-xs"
              />
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}
