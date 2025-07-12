import type { ColumnDef } from '@/common/components'
import type { Nachislenie } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { MonthNameCell } from '@/common/components/table/renderers/month-name'
import { formatLocaleDate } from '@/common/lib/format'

export const VedemostColumnDefs: ColumnDef<Nachislenie>[] = [
  {
    key: 'spravochnikBudjetName',
    header: 'budjet'
  },
  {
    key: 'typeVedomost',
    header: 'type'
  },
  {
    key: 'tabelDocDate',
    header: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.tabelDocDate)
  },
  {
    key: 'nachislenieMonth',
    header: 'month',
    renderCell: (row) => <MonthNameCell monthNumber={row.nachislenieMonth} />
  },
  {
    key: 'id',
    width: 160,
    minWidth: 160,
    renderCell: IDCell
  },
  {
    key: 'nachislenieYear',
    header: 'year'
  },
  {
    key: 'kol'
  },
  {
    key: 'nachislenieSum',
    header: 'nachislenie'
  },
  {
    key: 'dopOplataSum',
    header: 'dop-oplata'
  }
]
