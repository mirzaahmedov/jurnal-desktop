import type { ColumnDef } from '@/common/components'
import type { MainZarplata } from '@/common/models'

export const MainZarplataColumnDefs: ColumnDef<MainZarplata>[] = [
  {
    key: 'kartochka',
    header: 'card_num'
  },
  {
    key: 'fio'
  },
  {
    key: 'doljnostName',
    header: 'doljnost'
  },
  {
    key: 'spravochikZarplataZvanieName',
    header: 'military_rank'
  }
]
