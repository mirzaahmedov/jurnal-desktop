import type { ColumnDef } from '@/common/components'
import type { Operatsii } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const operatsiiColumns: ColumnDef<Operatsii>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  },
  {
    key: 'schet'
  },
  {
    key: 'sub_schet',
    header: 'subschet'
  }
]
