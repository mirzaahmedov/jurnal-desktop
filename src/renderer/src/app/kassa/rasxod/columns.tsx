import type { ColumnDef } from '@/common/components'
import type { KassaRasxodType } from '@/common/models'
import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaRasxodType>[] = [
  {
    key: 'doc_num',
    header: 'Документ №'
  },
  {
    key: 'doc_date',
    header: 'Дата проводки',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof KassaRasxodType] as string)
    }
  },
  {
    key: 'opisanie',
    header: 'Описания'
  },
  {
    numeric: true,
    key: 'summa',
    header: 'Сумма'
  },
  {
    key: 'spravochnik_podotchet_litso_name',
    header: 'Подотчетное лицо'
  }
]
