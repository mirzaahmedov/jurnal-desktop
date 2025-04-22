import type { ColumnDef } from '@/common/components'
import type { Region } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const RegionColumns: ColumnDef<Region>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  }
]
