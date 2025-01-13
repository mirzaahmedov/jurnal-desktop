import type { ColumnDef } from '@renderer/common/components'
import type { Iznos } from '@renderer/common/models'
import { formatLocaleDate } from '@renderer/common/lib/format'

export const columns: ColumnDef<Iznos>[] = [
  {
    key: 'inventar_num',
    header: 'Инвентар №'
  },
  {
    key: 'serial_num',
    header: 'Серийный номер'
  },
  {
    key: 'kol',
    header: 'Количество'
  },
  {
    key: 'sena',
    header: 'Цена'
  },
  {
    key: 'year',
    header: 'Год'
  },
  {
    key: 'month',
    header: 'Месяц'
  },
  {
    fit: true,
    key: 'iznos_start_date',
    header: 'Дата начала износа',
    renderCell(row) {
      return formatLocaleDate(row.iznos_start_date)
    }
  },
  {
    numeric: true,
    key: 'iznos_summa',
    header: 'Сумма износа'
  },
  {
    numeric: true,
    key: 'eski_iznos_summa',
    header: 'Сумма износа (Старый)'
  }
]
