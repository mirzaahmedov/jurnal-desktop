import type { ColumnDef } from '@/common/components'
import type { Podotchet } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'

export const PodotchetColumns: ColumnDef<Podotchet>[] = [
  {
    key: 'id',
    sort: true,
    width: 160,
    maxWidth: 160,
    renderCell: IDCell
  },
  {
    key: 'name',
    sort: true,
    minWidth: 200,
    width: '100%',
    header: 'fio'
  },
  {
    sort: true,
    key: 'rayon',
    width: 200
  },
  {
    sort: true,
    width: 200,
    key: 'position',
    header: 'doljnost'
  },
  {
    width: 200,
    sort: true,
    key: 'rank',
    header: 'military_rank'
  },
  {
    key: 'user_id',
    width: 200,
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
