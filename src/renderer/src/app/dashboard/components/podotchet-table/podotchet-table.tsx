import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { Pagination } from '@/common/components/pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card'

import { queryKeys } from '../../config'
import { getDashboardPodotchetQuery } from '../../service'
import { normalizePodotchetData, podotchetChildColumns, podotchetColumns } from './columns'

export interface PodotchetTableProps {
  date?: string
  budjet_id?: number
}
export const PodotchetTable = ({ date, budjet_id }: PodotchetTableProps) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5
  })

  const { t } = useTranslation()

  const { data: podotchets, isFetching } = useQuery({
    queryKey: [
      queryKeys.getPodotchetList,
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
          getChildRows={(row) => row.children}
          renderChildRows={(rows) => (
            <CollapsibleTable
              displayHeader={false}
              getRowId={(row) => row.id}
              getChildRows={() => undefined}
              data={rows}
              columnDefs={podotchetChildColumns}
            />
          )}
          getRowId={(row) => row.id}
          data={podotchetData}
        />
        <div className="p-5">
          <Pagination
            pageCount={podotchets?.meta?.pageCount ?? 0}
            page={pagination.page}
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
