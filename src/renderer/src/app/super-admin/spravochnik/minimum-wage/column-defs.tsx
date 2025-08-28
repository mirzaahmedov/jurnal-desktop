import type { MinimumWage } from './service'
import type { ColumnDef } from '@/common/components'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { formatLocaleDate } from '@/common/lib/format'

export const columnDefs: ColumnDef<MinimumWage>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'doc_num',
    minWidth: 200
  },
  {
    key: 'doc_date',
    minWidth: 200,
    renderCell: (row) => {
      return formatLocaleDate(row.doc_date)
    }
  },
  {
    key: 'start',
    minWidth: 200,
    renderCell: (row) => {
      return formatLocaleDate(row.start)
    }
  },
  {
    numeric: true,
    width: '100%',
    key: 'summa',
    renderCell: SummaCell
  }
]
