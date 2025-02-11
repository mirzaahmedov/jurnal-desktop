import type { ColumnDef } from '@/common/components'
import type { User } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const adminUserColumns: ColumnDef<User>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'fio'
  },
  {
    key: 'region_name',
    header: 'region'
  },
  {
    key: 'login',
    header: 'login'
  }
]
