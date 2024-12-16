import type { ColumnDef } from '@/common/components'
import type { User } from '@/common/models'

export const adminUserColumns: ColumnDef<User>[] = [
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
  }
]
