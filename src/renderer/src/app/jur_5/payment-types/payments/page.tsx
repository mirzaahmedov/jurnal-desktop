import type { Payment } from '@/common/models/payments'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { Input } from '@/common/components/ui/input'
import { useConfirm } from '@/common/features/confirm'
import { useDebounceValue, usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { DetailsView, ListView } from '@/common/views'

import { PaymentColumnDefs } from './columns'
import { PaymentsChangePayment } from './components/change-payment'
import { PaymentsDialog } from './dialog'
import {
  PaymentFilter,
  PaymentFilterTabOption,
  useCodeFilter,
  useNameFilter,
  useTabFilter
} from './filters'
import { PaymentsService } from './service'

const ColumnDefs = PaymentColumnDefs({ isMutable: true }).filter((column) => column.key !== 'id')

const PaymentsPage = () => {
  const setLayout = useLayout()
  const pagination = usePagination()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const [tabValue] = useTabFilter()
  const [name, setName] = useNameFilter()
  const [code, setCode] = useCodeFilter()
  const [selectedPayment, setSelectedPayment] = useState<Payment>()

  const [nameDebounced] = useDebounceValue(name)
  const [codeDebounced] = useDebounceValue(code)

  const { data: payments, isFetching } = useQuery({
    queryKey: [
      PaymentsService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        name: nameDebounced || undefined,
        code: codeDebounced || undefined
      }
    ],
    queryFn: PaymentsService.getAll
  })

  const { mutate: deletePayment, isPending: isDeleting } = useMutation({
    mutationFn: PaymentsService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [PaymentsService.QueryKeys.GetAll]
      })
      setSelectedPayment(undefined)
    },
    onError: (error) => {
      toast.error(t('delete_failed'))
      console.error(error)
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.payments'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        },
        {
          title: t('pages.payment_type')
        }
      ],
      content: PaymentFilter,
      onCreate: () => {
        setSelectedPayment(undefined)
        dialogToggle.open()
      }
    })
  }, [setLayout, t])

  const handleRowEdit = (row: Payment) => {
    setSelectedPayment(row)
    dialogToggle.open()
  }

  const handleRowDelete = (row: Payment) => {
    confirm({
      onConfirm: () => {
        deletePayment(row.id)
      }
    })
  }

  return tabValue === PaymentFilterTabOption.ChangePayment ? (
    <DetailsView>
      <DetailsView.Content>
        <PaymentsChangePayment />
      </DetailsView.Content>
    </DetailsView>
  ) : (
    <ListView>
      <div className="p-5 flex items-center justify-start gap-5">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('name')}
          className="w-64"
        />
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t('code')}
          className="w-64"
        />
      </div>
      <ListView.Content isLoading={isFetching || isDeleting}>
        <GenericTable
          data={payments?.data ?? []}
          columnDefs={ColumnDefs}
          className="table-generic-xs"
          onEdit={handleRowEdit}
          onDelete={handleRowDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={payments?.meta?.count ?? 0}
          pageCount={payments?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <PaymentsDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selectedPayment={selectedPayment}
      />
    </ListView>
  )
}

export default PaymentsPage
