import type { AdminBank, AdminBankMainSchet } from './interfaces'

import type { ColumnDef } from '@/common/components'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const AdminBankRegionColumnDefs: ColumnDef<AdminBank>[] = [
  {
    key: 'name'
  },
  {
    numeric: true,
    minWidth: 300,
    key: 'summa_from',
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_from}
      />
    )
  },
  {
    numeric: true,
    minWidth: 300,
    key: 'summa_to',
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_to}
      />
    )
  }
]

export const AdminBankMainSchetColumnDefs: ColumnDef<AdminBankMainSchet>[] = [
  {
    key: 'account_number',
    header: 'raschet-schet'
  },
  {
    key: 'jur2_schet',
    header: 'schet'
  },
  {
    key: 'budjet_name',
    header: 'budjet',
    width: 400
  },
  {
    numeric: true,
    key: 'summa_from',
    minWidth: 300,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_from}
      />
    )
  },
  {
    numeric: true,
    key: 'summa_to',
    minWidth: 300,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_to}
      />
    )
  }
]
