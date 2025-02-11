import type { ColumnDef } from '@/common/components'
import type { Podotchet } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const podotchetColumns: ColumnDef<Podotchet>[] = [
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
