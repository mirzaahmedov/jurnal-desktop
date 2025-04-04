import type { ColumnDef } from '@/common/components'
import type { TypeOperatsii } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const typeOperatsiiColumns: ColumnDef<TypeOperatsii>[] = [
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
