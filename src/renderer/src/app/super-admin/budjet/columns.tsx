import type { ColumnDef } from '@/common/components'
import type { Budjet } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const budgetColumns: ColumnDef<Budjet>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  }
]
