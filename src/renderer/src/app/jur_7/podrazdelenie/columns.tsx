import type { ColumnDef } from '@/common/components'
import type { WarehousePodrazdelenie } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'

export const WarehousePodrazdelenieColumns: ColumnDef<WarehousePodrazdelenie>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160
  },
  {
    key: 'name'
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
