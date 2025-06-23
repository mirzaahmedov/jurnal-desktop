import type { ColumnDef } from '@/common/components'
import type { User } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'

export const RegionUserColumns: ColumnDef<User>[] = [
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
  },
  {
    fit: true,
    key: 'user_id',
    minWidth: 200,
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        id={row.user_id}
        fio={row.fio}
        login={row.login}
      />
    )
  }
]
