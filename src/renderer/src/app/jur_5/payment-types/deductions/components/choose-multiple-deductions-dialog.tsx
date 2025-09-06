import type { Deduction } from '@/common/models/deduction'
import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Pagination } from '@/common/components/pagination'

import { DeductionColumnDefs } from '../columns'
import { DeductionsService } from '../service'

export interface ChooseMultipleDeductionsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  deductionIds: number[]
  onSelect?: (payment: Deduction) => void
  onSubmit?: () => void
  isSubmitting?: boolean
}
export const ChooseMultipleDeductionsDialog = ({
  deductionIds,
  onSelect,
  onSubmit,
  isSubmitting,
  ...props
}: ChooseMultipleDeductionsDialogProps) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { t } = useTranslation(['app'])

  const deductionsQuery = useQuery({
    queryKey: [DeductionsService.QueryKeys.GetAll, { page, limit }],
    queryFn: DeductionsService.getAll
  })
  const deductions = deductionsQuery.data?.data ?? []
  const count = deductionsQuery.data?.meta?.count ?? 0
  const pageCount = deductionsQuery.data?.meta?.pageCount ?? 0

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl h-full max-h-[800px] p-0">
          <div className="h-full flex flex-col w-full overflow-hidden">
            <DialogHeader className="p-5">
              <DialogTitle>{t('deduction')}</DialogTitle>
            </DialogHeader>
            <div className="relative flex-1 overflow-auto scrollbar">
              {deductionsQuery.isFetching ? <LoadingOverlay /> : null}
              <GenericTable
                columnDefs={DeductionColumnDefs}
                data={deductions}
                selectedIds={deductionIds}
                onClickRow={(row) => onSelect?.(row)}
                className="table-generic-xs"
              />
            </div>
            <DialogFooter className="w-full p-5 flex items-center !justify-between">
              <Pagination
                page={page}
                limit={limit}
                pageCount={pageCount}
                count={count}
                onChange={({ page, limit }) => {
                  if (page) {
                    setPage(page)
                  }
                  if (limit) {
                    setLimit(limit)
                  }
                }}
              />
              <Button
                onPress={onSubmit}
                isPending={isSubmitting}
                isDisabled={isSubmitting}
              >
                {t('save')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
