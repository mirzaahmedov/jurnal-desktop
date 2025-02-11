import type { ColumnDef } from '@/common/components'
import type { Region } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const regionColumns: ColumnDef<Region>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  }
]
