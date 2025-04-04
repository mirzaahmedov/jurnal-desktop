import type { KassaOstatok } from '@/common/models'

import { type ColumnDef } from '@/common/components'
import { IDCell } from '@/common/components/table/renderers/id'
import { getMonthName } from '@/common/lib/date'

export const kassaOstatokColumns: ColumnDef<KassaOstatok>[] = [
  {
    sort: true,
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'year'
  },
  {
    key: 'month',
    renderCell: (row) => getMonthName(row.month)
  }
]
