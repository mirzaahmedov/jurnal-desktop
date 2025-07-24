import type { Payment } from '@/common/models/payments'
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

import { PaymentColumnDefs } from '../columns'
import { PaymentsService } from '../service'

export interface ChoosePaymentsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedPaymentId: number | undefined
  onSelect?: (payment: Payment) => void
}
export const ChoosePaymentsDialog = ({
  selectedPaymentId,
  onSelect,
  ...props
}: ChoosePaymentsDialogProps) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { t } = useTranslation(['app'])

  const { data: payments, isFetching } = useQuery({
    queryKey: [PaymentsService.QueryKeys.GetAll, { page, limit }],
    queryFn: PaymentsService.getAll
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl h-full max-h-[800px]">
          <div className="h-full flex flex-col w-full overflow-hidden">
            <DialogHeader>
              <DialogTitle>{t('payment')}</DialogTitle>
            </DialogHeader>
            <div className="relative flex-1 overflow-auto scrollbar">
              {isFetching ? <LoadingOverlay /> : null}
              <GenericTable
                columnDefs={PaymentColumnDefs}
                data={payments?.data ?? []}
                selectedIds={selectedPaymentId ? [selectedPaymentId] : []}
                onClickRow={(row) => onSelect?.(row)}
              />
            </div>
            <div className="mt-5">
              <Pagination
                page={page}
                limit={limit}
                pageCount={payments?.meta?.pageCount ?? 0}
                count={payments?.meta?.count ?? 0}
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
