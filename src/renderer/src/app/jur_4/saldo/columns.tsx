import type { ColumnDef } from '@/common/components'
import type { PodotchetSaldo } from '@/common/models'

import { Trans } from 'react-i18next'

import { IDCell } from '@/common/components/table/renderers/id'
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
    key: 'account_number',
    header: 'raschet-schet'
  },
  {
    key: 'schet'
  }
]
