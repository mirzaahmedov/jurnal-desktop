import type { Deduction } from '@/common/models/deduction'
import type { DialogTriggerProps } from 'react-aria-components'

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
import { Pagination } from '@/common/components/pagination'

import { DeductionColumnDefs } from '../columns'
import { DeductionsService } from '../service'

export interface DeductionsChoosePaymentsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedDeductionId: number | undefined
  onSelect?: (payment: Deduction) => void
}
export const DeductionsChoosePaymentsDialog = ({
  selectedDeductionId,
  onSelect,
  ...props
}: DeductionsChoosePaymentsDialogProps) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { t } = useTranslation(['app'])

  const { data: deductions, isFetching } = useQuery({
    queryKey: [DeductionsService.QueryKeys.GetAll, { page, limit }],
    queryFn: DeductionsService.getAll
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl h-full max-h-[800px]">
          <div className="h-full flex flex-col w-full overflow-hidden">
            <DialogHeader>
              <DialogTitle>{t('deduction')}</DialogTitle>
            </DialogHeader>
            <div className="relative flex-1 overflow-auto scrollbar">
              {isFetching ? <LoadingOverlay /> : null}
              <GenericTable
                columnDefs={DeductionColumnDefs}
                data={deductions?.data ?? []}
                selectedIds={selectedDeductionId ? [selectedDeductionId] : []}
                onClickRow={(row) => onSelect?.(row)}
              />
            </div>
            <div className="mt-5">
              <Pagination
                page={page}
                limit={limit}
                pageCount={deductions?.meta?.pageCount ?? 0}
                count={deductions?.meta?.count ?? 0}
                onChange={({ page, limit }) => {
                  if (page) {
                    setPage(page)
                  }
                  if (limit) {
                    setLimit(limit)
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
