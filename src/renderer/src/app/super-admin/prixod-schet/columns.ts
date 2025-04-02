import type { ColumnDef } from '@/common/components'
import type { PrixodSchet } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const prixodSchetColumns: ColumnDef<PrixodSchet>[] = [
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
