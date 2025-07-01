import type { Deduction } from '@/common/models/deduction'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { PaymentColumnDefs } from './columns'
import { PaymentsDialog } from './dialog'
import { DeductionsService } from './service'

const DeductionsPage = () => {
  const setLayout = useLayout()
  const pagination = usePagination()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const [selectedPayment, setSelectedPayment] = useState<Deduction>()

  const { data: payments, isFetching } = useQuery({
    queryKey: [
      DeductionsService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: DeductionsService.getAll
  })

  const { mutate: deletePayment, isPending: isDeleting } = useMutation({
    mutationFn: DeductionsService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [DeductionsService.QueryKeys.GetAll]
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
      title: t('pages.deductions'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        },
        {
          title: t('pages.payment_type')
        }
      ],
      onCreate: () => {
        setSelectedPayment(undefined)
        dialogToggle.open()
      }
    })
  }, [setLayout, t])

  const handleRowEdit = (row: Deduction) => {
    setSelectedPayment(row)
    dialogToggle.open()
  }

  const handleRowDelete = (row: Deduction) => {
    confirm({
      onConfirm: () => {
        deletePayment(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isDeleting}>
        <GenericTable
          data={payments?.data ?? []}
          columnDefs={PaymentColumnDefs}
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

export default DeductionsPage
