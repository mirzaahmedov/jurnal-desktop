import type { ColumnDef } from '@/common/components'
import type { Jur7Podrazdelenie } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const podrazdelenieColumns: ColumnDef<Jur7Podrazdelenie>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160
  },
  {
    key: 'name'
  }
]
