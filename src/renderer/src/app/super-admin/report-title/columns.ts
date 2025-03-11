import type { ColumnDef } from '@/common/components'
import type { ReportTitle } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const unitColumns: ColumnDef<ReportTitle>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  }
]
