import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { Pagination } from '@/common/components/pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card'

import { DashboardQueryKeys } from '../../config'
import { getDashboardPodotchetQuery } from '../../service'
import { normalizePodotchetData, podotchetChildColumns, podotchetColumns } from './columns'

export interface DashboardPodotchetTableProps {
  date?: string
  budjet_id?: number
}
export const DashboardPodotchetTable = ({ date, budjet_id }: DashboardPodotchetTableProps) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5
  })

  const { t } = useTranslation()

  const { data: podotchets, isFetching } = useQuery({
    queryKey: [
      DashboardQueryKeys.getPodotchetList,
      {
        ...pagination,
        to: date!,
        budjet_id: budjet_id!
      }
    ],
    queryFn: getDashboardPodotchetQuery,
    enabled: !!date && !!budjet_id
  })

  const podotchetData = useMemo(
    () => normalizePodotchetData(podotchets?.data ?? undefined),
    [podotchets]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('podotchet-litso')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {isFetching ? <LoadingOverlay /> : null}
        <CollapsibleTable
          columnDefs={podotchetColumns}
          getRowId={(row) => row.id}
          data={podotchetData}
        >
          {({ row }) => (
            <CollapsibleTable
              displayHeader={false}
              getRowId={(row) => row.id}
              getChildRows={() => []}
              data={row.children ?? []}
              columnDefs={podotchetChildColumns}
            />
          )}
        </CollapsibleTable>
        <div className="p-5">
          <Pagination
            pageCount={podotchets?.meta?.pageCount ?? 0}
            page={pagination.page}
            count={podotchets?.meta?.count ?? 0}
            limit={pagination.limit}
            onChange={(values) =>
              setPagination((prev) => ({
                ...prev,
                ...values
              }))
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
