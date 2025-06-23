import type { ColumnDef } from '@/common/components'
import type { Podotchet } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'

export const PodotchetColumns: ColumnDef<Podotchet>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name',
    header: 'fio'
  },
  {
    key: 'rayon'
  },
  {
    key: 'position',
    header: 'doljnost'
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
