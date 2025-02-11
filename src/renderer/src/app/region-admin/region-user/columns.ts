import type { ColumnDef } from '@/common/components'
import type { User } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const regionUserColumns: ColumnDef<User>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'fio',
    header: 'Название'
  },
  {
    key: 'region_name',
    header: 'Название региона'
  },
  {
    key: 'login',
    header: 'Логин'
  },
  {
    key: 'role_name',
    header: 'Название роли'
  }
]
