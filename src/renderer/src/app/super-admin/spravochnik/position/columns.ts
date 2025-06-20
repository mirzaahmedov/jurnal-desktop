import type { ColumnDef } from '@/common/components'
import type { Position } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const PositionColumns: ColumnDef<Position>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  }
]
