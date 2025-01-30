import type { ColumnDef } from '@/common/components'
import type { KassaPrixodType } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaPrixodType>[] = [
  {
    key: 'doc_num',
    header: 'doc_num'
  },
  {
    key: 'doc_date',
    header: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof KassaPrixodType] as string)
    }
  },
  {
    key: 'opisanie',
    header: 'description'
  },
  {
    numeric: true,
    key: 'summa',
    header: 'summa'
  },
  {
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
  }
]
