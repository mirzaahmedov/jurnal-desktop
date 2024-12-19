import type { Naimenovanie, NaimenovanieKol } from '@/common/models'

import type { ColumnDef } from '@/common/components'
import { formatLocaleDate } from '@renderer/common/lib/format'

export const naimenovanieColumns: ColumnDef<Naimenovanie>[] = [
  {
    key: 'spravochnik_budjet_name',
    header: 'Бюджет'
  },
  {
    key: 'name',
    header: 'Название'
  },
  {
    key: 'edin',
    header: 'Единица измерения'
  },
  {
    key: 'inventar_num',
    header: 'Инвентарный номер'
  },
  {
    key: 'serial_num',
    header: 'Серийный номер'
  },
  {
    key: 'group_jur7_name',
    header: 'Группа'
  }
]

export const naimenovanieKolColumns: ColumnDef<NaimenovanieKol>[] = [
  {
    key: 'name',
    header: 'Название'
  },
  {
    key: 'result',
    header: 'Количество'
  },
  {
    key: 'sena',
    header: 'Цена',
    renderCell: (row) => {
      return row.sena ?? '-'
    }
  },
  {
    key: 'summa',
    header: 'Сумма',
    renderCell: (row) => {
      return row.sena ? (row.sena ? Number(row.sena) : 0) * (row.result ?? 0) : '-'
    }
  },
  {
    key: 'edin',
    header: 'Единица измерения'
  },
  {
    key: 'data_prixod',
    header: 'Дата прихода',
    renderCell: (row) => {
      return row.doc_date ? formatLocaleDate(row.doc_date) : '-'
    }
  },
  {
    key: 'group_jur7_name',
    header: 'Группа'
  },
  {
    key: 'spravochnik_budjet_name',
    header: 'Бюджет'
  }
]
