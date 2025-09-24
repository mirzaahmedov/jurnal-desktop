import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useState } from 'react'

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
import { Pagination } from '@/common/components/pagination'

import { usePagination } from '../components/view-documents-modal'
import { AdminZarplataDocumentColumnDefs } from './columns'
import { AdminZarplataDashboardService } from './service'

export interface ViewMainZarplataModalProps extends Omit<DialogTriggerProps, 'children'> {
  regionId: number | null
  budjetId: number | null
}
export const ViewMainZarplataModal: FC<ViewMainZarplataModalProps> = ({
  regionId,
  budjetId,
  ...props
}) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const adminMainZarplataDocsQuery = useQuery({
    queryKey: [
      AdminZarplataDashboardService.QueryKeys.GetMainZarplata,
      {
        regionId: regionId!,
        budjetId: budjetId!
      }
    ],
    queryFn: AdminZarplataDashboardService.getMainZarplata,
    enabled: !!regionId && !!budjetId
  })

  const { t } = useTranslation()
  const { currentData, totalCount, totalPages } = usePagination(
    adminMainZarplataDocsQuery.data ?? [],
    page,
    limit
  )

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-screen-2xl min-h-[500px] max-h-full flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{t('documents')}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
            {adminMainZarplataDocsQuery.isFetching ? <LoadingOverlay /> : null}
            <GenericTable
              columnDefs={AdminZarplataDocumentColumnDefs}
              data={currentData ?? []}
            />
          </div>
          <div>
            <Pagination
              page={page}
              limit={limit}
              onChange={({ page, limit }) => {
                if (page) setPage(page)
                if (limit) setLimit(limit)
              }}
              count={totalCount}
              pageCount={totalPages}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
