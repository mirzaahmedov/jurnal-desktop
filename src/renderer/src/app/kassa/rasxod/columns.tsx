import type { ColumnDef } from '@/common/components'
import type { KassaRasxodType } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaRasxodType>[] = [
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof KassaRasxodType] as string)
    }
  },
  {
    key: 'opisanie'
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
  }
]
