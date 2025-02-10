import { useMemo, useState } from 'react'

import { LoadingOverlay } from '@renderer/common/components'
import { CollapsibleTable } from '@renderer/common/components/collapsible-table'
import { Pagination } from '@renderer/common/components/pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/common/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { queryKeys } from '../../config'
import { getDashboardPodotchetQuery } from '../../service'
import { normalizePodotchetData, podotchetChildsColumns, podotchetColumns } from './columns'

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
        {
          // Todo: fix this
        }
        <CollapsibleTable
          columnDefs={podotchetColumns as any}
          childColumnDefs={podotchetChildsColumns}
          data={podotchetData as any}
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
