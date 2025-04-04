import type { ColumnDef } from '@/common/components'
import type { Bank } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const bankColumns: ColumnDef<Bank>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'mfo'
  },
  {
    key: 'bank_name',
    header: 'name'
  }
]
