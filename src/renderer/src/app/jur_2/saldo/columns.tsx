import type { BankSaldo } from '@/common/models'

import { Trans } from 'react-i18next'

import { type ColumnDef } from '@/common/components'
import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { UserCell } from '@/common/components/table/renderers/user'
import { getMonthName } from '@/common/lib/date'

export const BankSaldoColumns: ColumnDef<BankSaldo>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'year'
  },
  {
    key: 'month',
    renderCell: (row) => <Trans>{getMonthName(row.month)}</Trans>
  },
  {
    numeric: true,
    minWidth: 400,
    key: 'summa',
    renderCell: SummaCell
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
