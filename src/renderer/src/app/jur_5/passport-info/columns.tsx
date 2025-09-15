import type { ColumnDef } from '@/common/components'
import type { MainZarplata } from '@/common/models'

import { SummaCell } from '@/common/components/table/renderers/summa'

export const MainZarplataColumnDefs: ColumnDef<MainZarplata>[] = [
  {
    key: 'kartochka',
    minWidth: 100,
    header: 'card_num'
  },
  {
    key: 'fio',
    minWidth: 300
  },
  {
    key: 'doljnostName',
    minWidth: 200,
    header: 'doljnost'
  },
  {
    key: 'spravochikZarplataZvanieName',
    minWidth: 200,
    header: 'military_rank'
  },
  {
    key: 'doljnostOklad',
    header: 'oklad',
    numeric: true,
    renderCell: (row) => <SummaCell summa={row.doljnostOklad} />
  },
  {
    key: 'stavka'
  }
]
