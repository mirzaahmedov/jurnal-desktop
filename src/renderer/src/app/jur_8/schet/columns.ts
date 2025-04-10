import type { ColumnDef } from '@/common/components'
import type { JUR8Schet } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const prixodSchetColumns: ColumnDef<JUR8Schet>[] = [
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
