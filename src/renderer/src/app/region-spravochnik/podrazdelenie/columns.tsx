import type { ColumnDef } from '@/common/components'
import type { Podrazdelenie } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const PodrazdelenieColumns: ColumnDef<Podrazdelenie>[] = [
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
