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

export interface VacantsModalProps extends Omit<DialogTriggerProps, 'children'> {
  selectedId: number | null
}
export const VacantsModal: FC<VacantsModalProps> = ({ selectedId, ...props }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const adminVacantsQuery = useQuery({
    queryKey: [AdminZarplataDashboardService.QueryKeys.GetVacant, { mainSchetId: selectedId! }],
    queryFn: AdminZarplataDashboardService.getVacant,
    enabled: !!selectedId
  })

  const { t } = useTranslation()

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-screen-2xl min-h-[500px] max-h-full flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{t('vacant')}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
            {adminVacantsQuery.isFetching ? <LoadingOverlay /> : null}
            <GenericTable
              columnDefs={AdminZarplataDocumentColumnDefs}
              data={currentData ?? []}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
