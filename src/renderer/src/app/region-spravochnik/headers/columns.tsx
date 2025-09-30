import type { ColumnDef } from '@/common/components'
import type { IHeader } from '@/common/models/headers'

import { IDCell } from '@/common/components/table/renderers/id'

export const PodrazdelenieColumns: ColumnDef<IHeader>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'value'
  }
]
