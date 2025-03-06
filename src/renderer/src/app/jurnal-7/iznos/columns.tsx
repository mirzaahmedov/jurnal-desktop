import type { ColumnDef } from '@renderer/common/components'
import type { OstatokProduct } from '@renderer/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { getMonthName } from '@renderer/common/lib/date'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'

export const columns: ColumnDef<OstatokProduct>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name',
    header: 'Наименование',
    headerClassName: 'min-w-[400px] whitespace-pre-wrap',
    className: 'min-w-[400px] whitespace-pre-wrap'
  },
  {
    fit: true,
    key: 'inventar_num',
    header: 'Инвентар №',
    renderCell: (row) => row.product.inventar_num
  },
  {
    fit: true,
    key: 'serial_num',
    header: 'Серийный номер',
    renderCell: (row) => row.product.serial_num
  },
  {
    key: 'kol',
    header: 'Количество',
    renderCell: (row) => row.to.kol
  },
  {
    numeric: true,
    key: 'sena',
    header: 'Цена',
    renderCell: (row) => row.to.sena
  },
  {
    key: 'year',
    header: 'Год'
  },
  {
    key: 'month',
    header: 'Месяц',
    renderCell: (row) => getMonthName(row.month)
  },
  {
    key: 'iznos_schet',
    header: 'schet'
  },
  {
    key: 'iznos_sub_schet',
    header: 'subschet'
  },
  {
    fit: true,
    key: '',
    header: 'Дата начала износа',
    renderCell: (row) => formatLocaleDate(row.iznos_start)
  },
  {
    numeric: true,
    key: 'iznos_summa',
    header: 'Сумма износа (Общий)',
    renderCell: (row) => formatNumber(row.to.iznos_summa ?? 0)
  },
  {
    numeric: true,
    key: 'iznos_summa_bir_oylik',
    header: 'Сумма износа (Месяц)',
    renderCell: (row) => formatNumber(row.to.month_iznos ?? 0)
  },
  {
    numeric: true,
    key: 'eski_iznos_summa',
    header: 'Сумма износа (Старый)',
    renderCell: (row) => formatNumber(row.to.eski_iznos_summa)
  }
]
