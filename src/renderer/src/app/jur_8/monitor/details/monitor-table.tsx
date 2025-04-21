import type { FinancialReceiptFormValues } from './config'
import type { FinancialReceiptProvodka } from '@/common/models'

import {
  type EditableColumnDef,
  EditableTable,
  type EditableTableProps
} from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export interface FinancialReceiptMonitorTableProps
  extends Omit<EditableTableProps<FinancialReceiptFormValues, 'childs'>, 'columnDefs' | 'data'> {
  columns: EditableColumnDef<FinancialReceiptProvodka>[]
}
export const FinancialReceiptMonitorTable = ({
  columns,
  ...props
}: FinancialReceiptMonitorTableProps) => {
  return (
    <EditableTable
      columnDefs={columns}
      getRowClassName={({ index, rows }) =>
        cn(
          '[&_input]:p-1 scroll-my-32',
          index === (rows?.length ?? 0) - 1 &&
            '[&_input]:font-bold sticky bottom-0 z-50 shadow-sm-up'
        )
      }
      {...props}
    />
  )
}
