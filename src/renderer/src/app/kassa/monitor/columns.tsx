import type { ColumnDef } from '@/common/components'
import type { KassaMonitoringType } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaMonitoringType>[] = [
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof KassaMonitoringType] as string)
    }
  },
  {
    key: 'opisanie'
  },
  {
    numeric: true,
    key: 'prixod_sum',
    header: 'prixod'
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    header: 'rasxod'
  },
  {
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
  },
  {
    key: 'user_id',
    header: 'created-by-user',
    renderCell(row) {
      return `${row.fio} (@${row.login})`
    }
  }
]
