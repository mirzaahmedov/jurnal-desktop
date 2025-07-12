import type { ReportItem } from './types'
import type { CollapsibleColumnDef } from '@/common/components/collapsible-table'

import { IDCell } from '@/common/components/table/renderers/id'
import { MonthNameCell } from '@/common/components/table/renderers/month-name'

export const ReportColumnDefs: CollapsibleColumnDef<ReportItem>[] = [
  {
    key: 'id',
    minWidth: 100,
    renderCell: IDCell as any
  },
  {
    key: 'year',
    width: 100
  },
  {
    key: 'month',
    width: 100,
    renderCell: (row) => <MonthNameCell monthNumber={row.month} />
  },
  {
    key: 'name',
    width: 300
  },
  {
    key: 'type',
    width: 200
  },
  {
    key: 'budjet',
    width: 200
  },
  {
    key: 'kol',
    width: 100
  },
  {
    key: 'enabled',
    width: 100
  }
]
