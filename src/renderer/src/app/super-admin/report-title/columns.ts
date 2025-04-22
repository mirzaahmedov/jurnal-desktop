import type { ColumnDef } from '@/common/components'
import type { ReportTitle } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const ReportTitleColumns: ColumnDef<ReportTitle>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  }
]
