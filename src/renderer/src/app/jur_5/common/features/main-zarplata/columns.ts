import type { ColumnDef } from '@/common/components'
import type { MainZarplata } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const MainZarplataColumnDefs: ColumnDef<MainZarplata>[] = [
  {
    key: 'id',
    width: 160,
    minWidth: 160,
    renderCell: IDCell
  },
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
  },
  {
    key: 'status'
  }
]
