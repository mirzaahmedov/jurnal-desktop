import type { ColumnDef } from '@/common/components'
import type { Sostav } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const sostavColumns: ColumnDef<Sostav>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  },
  {
    key: 'rayon'
  }
]
