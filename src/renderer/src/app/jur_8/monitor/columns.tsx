import type { ColumnDef } from '@/common/components'
import type { FinancialReceipt } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { MonthNameCell } from '@/common/components/table/renderers/month-name'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const FinancialReceiptColumns: ColumnDef<FinancialReceipt>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'month',
    renderCell: (row) => <MonthNameCell monthNumber={row.month} />
  },
  {
    key: 'year'
  },
  {
    minWidth: 300,
    numeric: true,
    key: 'summa',
    renderCell: SummaCell
  }
]
