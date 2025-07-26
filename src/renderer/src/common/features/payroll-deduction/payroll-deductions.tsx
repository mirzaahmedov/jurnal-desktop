import type { PayrollDeductionFormValues } from './config'
import type { MainZarplata } from '@/common/models'
import type { PayrollDeduction } from '@/common/models/payroll-deduction'
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
import { PayrollDeductionDialog } from './payroll-deduction-dialog'
import { PayrollDeductionService } from './service'

export interface PayrollDeductionsProps {
  mainZarplata: MainZarplata
  setDeductionsTotal?: (total: number) => void
}
export const PayrollDeductions = ({ mainZarplata, setDeductionsTotal }: PayrollDeductionsProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()

  const [selectedPayment, setSelectedPayment] = useState<PayrollDeduction | undefined>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { data: payments, isFetching: isFetchingPayments } = useQuery({
    queryKey: [PayrollDeductionService.QueryKeys.GetByMainZarplataId, mainZarplata.id],
    queryFn: PayrollDeductionService.getByMainZarplataId
  })

  const { mutateAsync: createPayment, isPending: isCreatingPayment } = useMutation({
    mutationFn: PayrollDeductionService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollDeductionService.QueryKeys.GetByMainZarplataId]
      })
      dialogToggle.close()
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const { mutateAsync: updatePayment, isPending: isUpdatingPayment } = useMutation({
    mutationFn: PayrollDeductionService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollDeductionService.QueryKeys.GetByMainZarplataId]
      })
      dialogToggle.close()
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const { mutate: deletePayment, isPending: isDeletingPayment } = useMutation({
    mutationFn: PayrollDeductionService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollDeductionService.QueryKeys.GetByMainZarplataId]
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
  const handlePaymentEdit = (payment: PayrollDeduction) => {
    setSelectedPayment(payment)
    dialogToggle.open()
  }
  const handlePaymentDelete = (payment: PayrollDeduction) => {
    confirm({
      onConfirm: () => {
        deletePayment(payment.id)
      }
    })
  }

  const handlePaymentSubmit = (
    values: PayrollDeductionFormValues,
    form: UseFormReturn<PayrollDeductionFormValues>
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
    setDeductionsTotal?.(payments?.totalCount ?? 0)
  }, [setDeductionsTotal, payments?.totalCount])

  return (
    <>
      <div className="relative h-full max-h-[500px] flex flex-col bg-gray-50 border">
        <div className="p-2.5 text-xs uppercase font-bold text-gray-600">
          {t('payroll_deductions')}
        </div>
        {isFetchingPayments || isUpdatingPayment || isDeletingPayment ? <LoadingOverlay /> : null}
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
            className="table-generic-xs border-t border-l max-h-[400px] overflow-auto scrollbar"
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

      <PayrollDeductionDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selectedPayment}
        onSubmit={handlePaymentSubmit}
      />
    </>
  )
}
