import type { ColumnDef } from '@/common/components'
import type { Naimenovanie, NaimenovanieKol } from '@/common/models'

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
    key: 'spravochnik_budjet_name',
    header: 'Бюджет'
  },
  {
    key: 'name',
    header: 'Название'
  },
  {
    key: 'result',
    header: 'Количество'
  },
  {
    key: 'edin',
    header: 'Единица измерения'
  },
  {
    key: 'group_jur7_name',
    header: 'Группа'
  }
]
