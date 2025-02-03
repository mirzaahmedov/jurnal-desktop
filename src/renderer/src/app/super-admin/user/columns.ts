import type { ColumnDef } from '@/common/components'
import type { User } from '@/common/models'

export const adminUserColumns: ColumnDef<User>[] = [
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
