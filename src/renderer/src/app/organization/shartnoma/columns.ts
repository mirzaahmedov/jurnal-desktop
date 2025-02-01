import type { ColumnDef } from '@/common/components'
import type { Shartnoma } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'

export const shartnomaColumns: ColumnDef<Shartnoma>[] = [
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    key: 'opisanie'
  },
  {
    key: 'smeta_number',
    header: 'smeta'
  }
]
