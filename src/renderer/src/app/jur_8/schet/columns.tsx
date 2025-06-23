import type { ColumnDef } from '@/common/components'
import type { FinancialReceiptPrixodSchet } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'

export const PrixodSchetColumns: ColumnDef<FinancialReceiptPrixodSchet>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'schet'
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
