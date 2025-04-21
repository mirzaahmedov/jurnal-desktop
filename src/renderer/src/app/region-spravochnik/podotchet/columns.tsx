import type { ColumnDef } from '@/common/components'
import type { Podotchet } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const PodotchetColumns: ColumnDef<Podotchet>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name',
    header: 'fio'
  },
  {
    key: 'rayon'
  }
]
