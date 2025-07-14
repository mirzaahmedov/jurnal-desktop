import type { ReportItem } from './types'
import type { CollapsibleColumnDef } from '@/common/components/collapsible-table'

import { IDCell } from '@/common/components/table/renderers/id'
import { MonthNameCell } from '@/common/components/table/renderers/month-name'
import { Checkbox } from '@/common/components/ui/checkbox'

export const ReportColumnDefs: CollapsibleColumnDef<ReportItem>[] = [
  {
    key: 'id',
    minWidth: 100,
    renderCell: IDCell as any
  },
  {
    key: 'year',
    width: 60
  },
  {
    key: 'month',
    width: 100,
    minWidth: 100,
    renderCell: (row) => <MonthNameCell monthNumber={row.month} />
  },
  {
    key: 'name',
    width: 300,
    minWidth: 300
  },
  {
    key: 'type',
    width: 160,
    minWidth: 160
  },
  {
    key: 'budjet',
    width: 200,
    minWidth: 200
  },
  {
    key: 'kol',
    width: 100,
    minWidth: 100
  },
  {
    key: 'enabled',
    width: 100,
    minWidth: 100,
    renderCell: (row) => <Checkbox checked={Boolean(row.enabled)} />
  }
]
