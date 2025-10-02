import type { ColumnDef } from '@/common/components'
import type { PodotchetSaldo } from '@/common/models'

import { Trans } from 'react-i18next'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { UserCell } from '@/common/components/table/renderers/user'
import { getMonthName } from '@/common/lib/date'

export const PodotchetSaldoColumns: ColumnDef<PodotchetSaldo>[] = [
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
    key: 'prixod',
    renderCell: (row) => <SummaCell summa={row.prixod} />
  },
  {
    numeric: true,
    key: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.rasxod} />
  },
  {
    numeric: true,
    key: 'summa',
    renderCell: (row) => <SummaCell summa={row.summa} />
  },
  {
    key: 'account_number',
    header: 'raschet-schet'
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
