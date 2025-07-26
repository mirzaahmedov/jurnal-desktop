import type { PayrollPaymentFormValues } from './config'
import type { MainZarplata } from '@/common/models'
import type { PayrollPayment } from '@/common/models/payroll-payment'
import type { UseFormReturn } from 'react-hook-form'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { useToggle } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'

import { useConfirm } from '../confirm'
import { PayrollPaymentDialog } from './payroll-payment-dialog'
import { PayrollPaymentService } from './service'

export interface PayrollPaymentsProps {
  mainZarplata: MainZarplata
  setPaymentsTotal?: (total: number) => void
}
export const PayrollPayments = ({ mainZarplata, setPaymentsTotal }: PayrollPaymentsProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()

  const [selectedPayment, setSelectedPayment] = useState<PayrollPayment | undefined>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { data: payments, isFetching: isFetchingPayments } = useQuery({
    queryKey: [PayrollPaymentService.QueryKeys.GetAll, mainZarplata.id],
    queryFn: PayrollPaymentService.getAll
  })

  const { mutateAsync: createPayment, isPending: isCreatingPayment } = useMutation({
    mutationFn: PayrollPaymentService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll]
      })
      dialogToggle.close()
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const { mutateAsync: updatePayment, isPending: isUpdatingPayment } = useMutation({
    mutationFn: PayrollPaymentService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll]
      })
      dialogToggle.close()
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const { mutate: deletePayment, isPending: isDeletingPayment } = useMutation({
    mutationFn: PayrollPaymentService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const handlePaymentCreate = () => {
    setSelectedPayment(undefined)
    dialogToggle.open()
  }
  const handlePaymentEdit = (payment: PayrollPayment) => {
    setSelectedPayment(payment)
    dialogToggle.open()
  }
  const handlePaymentDelete = (payment: PayrollPayment) => {
    confirm({
      onConfirm: () => {
        deletePayment(payment.id)
      }
    })
  }

  const handlePaymentSubmit = (
    values: PayrollPaymentFormValues,
    form: UseFormReturn<PayrollPaymentFormValues>
  ) => {
    if (selectedPayment) {
      updatePayment({
        id: selectedPayment.id,
        values: {
          ...values,
          mainZarplataId: mainZarplata.id
        }
      }).then(() => form.reset())
    } else {
      createPayment({
        ...values,
        mainZarplataId: mainZarplata.id
      }).then(() => form.reset())
    }
  }

  useEffect(() => {
    setPaymentsTotal?.(payments?.totalCount ?? 0)
  }, [payments?.totalCount, setPaymentsTotal])

  return (
    <>
      <div className="relative h-full max-h-[500px] flex flex-col bg-gray-50 border">
        {isFetchingPayments || isUpdatingPayment || isDeletingPayment ? <LoadingOverlay /> : null}
        <div className="p-2.5 text-xs uppercase font-bold text-gray-600">
          {t('payroll_payments')}
        </div>
        <div className="flex-1 overflow-auto scrollbar">
          <GenericTable
            data={payments?.data ?? []}
            columnDefs={[
              {
                key: 'name'
              },
              {
                key: 'percentage',
                header: 'foiz'
              },
              {
                key: 'summa',
                renderCell: (row) => <SummaCell summa={row.summa} />,
                numeric: true
              }
            ]}
            className="table-generic-xs border-t border-l"
            onEdit={handlePaymentEdit}
            onDelete={handlePaymentDelete}
            footer={
              <FooterRow>
                <FooterCell
                  title={t('total')}
                  colSpan={3}
                />
                <FooterCell content={formatNumber(payments?.totalCount ?? 0)} />
              </FooterRow>
            }
          />
        </div>
        <div className="text-end p-2.5">
          <Button
            className="mt-2"
            isPending={isCreatingPayment}
            onClick={handlePaymentCreate}
          >
            <Plus className="btn-icon icon-start" /> {t('add')}
          </Button>
        </div>
      </div>

      <PayrollPaymentDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selectedPayment}
        onSubmit={handlePaymentSubmit}
        doljnostOklad={mainZarplata.doljnostOklad ?? 0}
      />
    </>
  )
}
