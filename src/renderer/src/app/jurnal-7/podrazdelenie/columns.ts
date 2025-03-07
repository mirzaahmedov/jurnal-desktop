import type { ColumnDef } from '@/common/components'
import type { Jur7Podrazdelenie } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const podrazdelenieColumns: ColumnDef<Jur7Podrazdelenie>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  }
]
