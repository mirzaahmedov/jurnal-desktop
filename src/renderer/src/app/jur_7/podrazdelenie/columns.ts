import type { ColumnDef } from '@/common/components'
import type { WarehousePodrazdelenie } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const WarehousePodrazdelenieColumns: ColumnDef<WarehousePodrazdelenie>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160
  },
  {
    key: 'name'
  }
]
