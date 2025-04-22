import type { ColumnDef } from '@/common/components'
import type { FinancialReceiptPrixodSchet } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const PrixodSchetColumns: ColumnDef<FinancialReceiptPrixodSchet>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'schet'
  }
]
