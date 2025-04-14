import type { ColumnDef } from '@/common/components'
import type { OrganSaldo } from '@/common/models'

import { Trans } from 'react-i18next'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { getMonthName } from '@/common/lib/date'

export const OrganSaldoColumns: ColumnDef<OrganSaldo>[] = [
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
  }
]
