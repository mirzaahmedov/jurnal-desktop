import type { ColumnDef } from '@/common/components'
import type { Payment } from '@/common/models/payments'
import type { CheckedState } from '@radix-ui/react-checkbox'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { toast } from 'react-toastify'

import { Spinner } from '@/common/components'
import { IDCell } from '@/common/components/table/renderers/id'
import { Checkbox } from '@/common/components/ui/checkbox'

import { PaymentsService } from './service'

interface CheckboxCellProps {
  row: Payment
  field: keyof Payment & string
}
const CheckboxCell = ({ row, field }: CheckboxCellProps) => {
  const queryClient = useQueryClient()
  const { mutate: updatePayment, isPending: isUpdating } = useMutation({
    mutationKey: [PaymentsService.QueryKeys.Update, row.id],
    mutationFn: PaymentsService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [PaymentsService.QueryKeys.GetAll]
      })
    },
    onError: (error) => {
      console.log(error)
      toast.error(t('update_failed'))
    }
  })

  const handleCheckedChange = (checked: CheckedState) => {
    updatePayment({
      ...row,
      [field]: checked
    })
  }

  return isUpdating ? (
    <Spinner />
  ) : (
    <Checkbox
      checked={Boolean(row[field])}
      disabled={isUpdating}
      onCheckedChange={handleCheckedChange}
    />
  )
}

export const PaymentColumnDefs: ColumnDef<Payment>[] = [
  {
    key: 'id',
    minWidth: 120,
    renderCell: IDCell
  },
  {
    key: 'code'
  },
  {
    minWidth: 200,
    key: 'name'
  },
  {
    minWidth: 200,
    key: 'nameUz',
    header: 'name_uz'
  },
  {
    width: 100,
    minWidth: 100,
    key: 'isINPSTaxable',
    header: 'inps_taxable',
    renderCell: (row) => (
      <CheckboxCell
        row={row}
        field="isINPSTaxable"
      />
    )
  },
  {
    width: 100,
    minWidth: 100,
    key: 'isUnionDeductible',
    header: 'labor_union_fee',
    renderCell: (row) => (
      <CheckboxCell
        row={row}
        field="isUnionDeductible"
      />
    )
  },
  {
    width: 100,
    minWidth: 100,
    key: 'isAlimonyDeductible',
    header: 'alimony_deductable',
    renderCell: (row) => (
      <CheckboxCell
        row={row}
        field="isAlimonyDeductible"
      />
    )
  },
  {
    width: 100,
    minWidth: 100,
    key: 'isIncomeTaxDeductible',
    header: 'income_tax',
    renderCell: (row) => (
      <CheckboxCell
        row={row}
        field="isIncomeTaxDeductible"
      />
    )
  },
  {
    width: 100,
    minWidth: 100,
    key: 'isUSTDeductible',
    header: 'esp_tax',
    renderCell: (row) => (
      <CheckboxCell
        row={row}
        field="isUSTDeductible"
      />
    )
  },
  {
    width: 80,
    minWidth: 80,
    key: 'expenseAccount',
    header: 'expense_schet'
  },
  {
    width: 80,
    minWidth: 80,
    key: 'creditAccount',
    header: 'credit_schet'
  },
  {
    width: 80,
    minWidth: 80,
    key: 'subAccount',
    header: 'subschet'
  },
  {
    key: 'sourceFund',
    header: 'main_fund'
  }
  // {
  //   minWidth: 300,
  //   key: 'calculationFormula',
  //   header: 'calc_formula'
  // }
]
