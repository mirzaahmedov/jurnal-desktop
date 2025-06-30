import type { ColumnDef } from '@/common/components'
import type { MainZarplata } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const MainZarplataColumns: ColumnDef<MainZarplata>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'fio'
  },
  {
    key: 'rayon'
  }
]
