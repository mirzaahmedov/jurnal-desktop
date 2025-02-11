import type { ColumnDef } from '@/common/components'
import type { Role } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const roleColumns: ColumnDef<Role>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  }
]
