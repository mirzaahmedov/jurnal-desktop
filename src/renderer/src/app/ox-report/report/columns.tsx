import type { ColumnDef } from '@/common/components'
import type { OX } from '@/common/models'

import { getMonthName } from '@/common/lib/date'

export const oxReportColumns: ColumnDef<OX.Report>[] = [
  {
    key: 'month',
    header: 'Месяц',
    renderCell: (row) => {
      return getMonthName(row.month)
    }
  },
  {
    key: 'year',
    header: 'Год'
  },
  {
    numeric: true,
    key: 'ajratilgan_mablag',
    header: 'Ажратилган маблағ'
  },
  {
    numeric: true,
    key: 'tulangan_mablag_smeta_buyicha',
    header: 'Туланган маблағ'
  },
  {
    numeric: true,
    key: 'kassa_rasxod',
    header: 'Касса расход'
  },
  {
    numeric: true,
    key: 'haqiqatda_harajatlar',
    header: 'Хакикатда харажатлар'
  },
  {
    numeric: true,
    key: 'qoldiq',
    header: 'Колдик'
  }
]
