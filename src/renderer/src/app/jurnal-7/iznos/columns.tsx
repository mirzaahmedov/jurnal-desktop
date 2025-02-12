import type { ColumnDef } from '@renderer/common/components'
import type { Iznos } from '@renderer/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { getMonthName } from '@renderer/common/lib/date'
import { formatLocaleDate } from '@renderer/common/lib/format'

export const columns: ColumnDef<Iznos>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name',
    header: 'Наименование',
    className: 'w-80'
  },
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
    numeric: true,
    key: 'sena',
    header: 'Цена'
  },
  {
    key: 'year',
    header: 'Год'
  },
  {
    key: 'month',
    header: 'Месяц',
    renderCell(row) {
      return getMonthName(row.month)
    }
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
    header: 'Сумма износа (Общий)'
  },
  {
    numeric: true,
    key: 'month_iznos_summa',
    header: 'Сумма износа (Месяц)'
  },
  {
    numeric: true,
    key: 'eski_iznos_summa',
    header: 'Сумма износа (Старый)'
  }
]
