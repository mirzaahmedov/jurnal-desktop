import type { ColumnDef } from '@/common/components'
import type { MainZarplata } from '@/common/models'

export const columnDefs: ColumnDef<MainZarplata>[] = [
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
    key: 'xarbiy',
    header: 'military_rank'
  }
]
