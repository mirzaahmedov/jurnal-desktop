import type { PayrollDeductionFormValues } from './config'
import type { MainZarplata } from '@/common/models'
import type { PayrollDeduction } from '@/common/models/payroll-deduction'
import type { UseFormReturn } from 'react-hook-form'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { useToggle } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'

import { useConfirm } from '../confirm'
import { AlimentDeductionsDialog } from './aliment-deductions/aliment-deductions-modal'
import { DeductionType, PayrollDeductionDialog } from './payroll-deduction-dialog'
import { PayrollDeductionService } from './service'

export interface PayrollDeductionsProps {
  mainZarplata: MainZarplata
  setDeductionsTotal?: (total: number) => void
}
export const PayrollDeductions = ({ mainZarplata, setDeductionsTotal }: PayrollDeductionsProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()

  const [selectedPayment, setSelectedPayment] = useState<PayrollDeduction | undefined>()
  const [alimentData, setAlimentData] = useState<PayrollDeduction | undefined>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { data: deductions, isFetching: isFetchingDeductions } = useQuery({
    queryKey: [PayrollDeductionService.QueryKeys.GetByMainZarplataId, mainZarplata.id],
    queryFn: PayrollDeductionService.getByMainZarplataId
  })

  const { mutateAsync: createDeduction, isPending: isCreatingDeduction } = useMutation({
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
  const { mutateAsync: updateDeduction, isPending: isUpdatingDeduction } = useMutation({
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
  const { mutate: deleteDeduction, isPending: isDeletingDeduction } = useMutation({
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

  const handleDeductionCreate = () => {
    setSelectedPayment(undefined)
    dialogToggle.open()
  }
  const handleDeductionEdit = (payment: PayrollDeduction) => {
    setSelectedPayment(payment)
    dialogToggle.open()
  }
  const handleDeductionDelete = (payment: PayrollDeduction) => {
    confirm({
      onConfirm: () => {
        deleteDeduction(payment.id)
      }
    })
  }

  const handleDeductionSubmit = (
    values: PayrollDeductionFormValues,
    deductionType: DeductionType,
    form: UseFormReturn<PayrollDeductionFormValues>
  ) => {
    if (selectedPayment) {
      updateDeduction({
        id: selectedPayment.id,
        values:
          deductionType === DeductionType.Percentage
            ? {
                deductionId: values.deductionId,
                percentage: values.percentage,
                summa: 0,
                mainZarplataId: mainZarplata.id
              }
            : {
                deductionId: values.deductionId,
                summa: values.summa,
                percentage: 0,
                mainZarplataId: mainZarplata.id
              }
      }).then(() => form.reset())
    } else {
      createDeduction(
        deductionType === DeductionType.Percentage
          ? {
              deductionId: values.deductionId,
              percentage: values.percentage,
              summa: 0,
              mainZarplataId: mainZarplata.id
            }
          : {
              deductionId: values.deductionId,
              summa: values.summa,
              percentage: 0,
              mainZarplataId: mainZarplata.id
            }
      ).then(() => form.reset())
    }
  }

  useEffect(() => {
    setDeductionsTotal?.(deductions?.totalCount ?? 0)
  }, [setDeductionsTotal, deductions?.totalCount])

  return (
    <>
      <div className="relative h-full max-h-[500px] flex flex-col bg-gray-50 border">
        <div className="p-2.5 text-xs uppercase font-bold text-gray-600">
          {t('payroll_deductions')}
        </div>
        {isFetchingDeductions || isUpdatingDeduction || isDeletingDeduction ? (
          <LoadingOverlay />
        ) : null}
        <div className="flex-1 overflow-auto scrollbar">
          <GenericTable
            data={deductions?.data ?? []}
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
            onEdit={handleDeductionEdit}
            onDelete={handleDeductionDelete}
            actions={(row) =>
              row.code === 1 ? (
                <div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setAlimentData?.(row)}
                  >
                    <Eye className="btn-icon" />
                  </Button>
                </div>
              ) : null
            }
            footer={
              <FooterRow>
                <FooterCell
                  title={t('total')}
                  colSpan={3}
                />
                <FooterCell content={formatNumber(deductions?.totalCount ?? 0)} />
              </FooterRow>
            }
          />
        </div>
        <div className="text-end p-2.5">
          <Button
            className="mt-2"
            isPending={isCreatingDeduction}
            onClick={handleDeductionCreate}
          >
            <Plus className="btn-icon icon-start" /> {t('add')}
          </Button>
        </div>
      </div>

      <PayrollDeductionDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selectedPayment}
        onSubmit={handleDeductionSubmit}
      />

      <AlimentDeductionsDialog
        deductionId={alimentData?.deductionId ?? 0}
        mainZarplataId={alimentData?.mainZarplataId ?? 0}
        isOpen={!!alimentData}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAlimentData(undefined)
          }
        }}
      />
    </>
  )
}
