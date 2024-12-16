import type { ColumnDef } from '@/common/components'
import type { KassaMonitoringType } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaMonitoringType>[] = [
  {
    key: 'doc_num',
    header: 'Документ №'
  },
  {
    key: 'doc_date',
    header: 'Дата проводки',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof KassaMonitoringType] as string)
    }
  },
  {
    key: 'opisanie',
    header: 'Описания'
  },
  {
    numeric: true,
    key: 'prixod_sum',
    header: 'Приход'
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    header: 'Расход'
  },
  {
    key: 'spravochnik_podotchet_litso_name',
    header: 'Подотчетное лицо'
  },
  {
    key: 'user_id',
    header: 'Создано пользователем',
    renderCell(row) {
      return `${row.fio} (@${row.login})`
    }
  }
]
