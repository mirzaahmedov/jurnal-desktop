import type { ColumnDef } from '@/common/components'
import type { MainZarplata } from '@/common/models'

import { SelectCell } from '@/common/components/table/renderers/select'

export const MainZarplataColumnDefs: ColumnDef<MainZarplata>[] = [
  {
    key: 'id',
    header: ' ',
    width: 44,
    minWidth: 44,
    renderCell: SelectCell
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
    key: 'spravochikZarplataZvanieName',
    header: 'military_rank'
  }
]
