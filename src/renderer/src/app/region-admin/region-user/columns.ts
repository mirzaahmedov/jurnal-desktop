import type { ColumnDef } from '@/common/components'
import type { User } from '@/common/models'

export const regionUserColumns: ColumnDef<User>[] = [
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
