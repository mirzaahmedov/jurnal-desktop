import type { ColumnDef } from '@/common/components'
import type { Shartnoma } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'

export const shartnomaColumns: ColumnDef<Shartnoma>[] = [
  {
    key: 'doc_num',
    header: '№ договора'
  },
  {
    key: 'doc_date',
    header: 'Дата договора',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    numeric: true,
    key: 'summa',
    header: 'Сумма'
  },
  {
    key: 'opisanie',
    header: 'Описание'
  },
  {
    key: 'smeta_number',
    header: 'Смета'
  }
]
