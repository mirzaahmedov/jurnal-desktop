import type { MinimumWage } from './service'
import type { ColumnDef } from '@/common/components'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const columnDefs: ColumnDef<MinimumWage>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    numeric: true,
    width: '100%',
    key: 'summa',
    renderCell: SummaCell
  }
]
