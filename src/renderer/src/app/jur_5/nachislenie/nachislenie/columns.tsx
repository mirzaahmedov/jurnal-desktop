import type { ColumnDef } from '@/common/components'
import type { Nachislenie } from '@/common/models'

import { MonthNameCell } from '@/common/components/table/renderers/month-name'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const NachislenieColumns: ColumnDef<Nachislenie>[] = [
  {
    key: 'docNum',
    header: 'doc_num',
    width: 100,
    minWidth: 100
  },
  {
    key: 'docDate',
    header: 'doc_date',
    minWidth: 100
  },
  {
    numeric: true,
    key: 'naRukiSum',
    header: 'na_ruki',
    minWidth: 150,
    renderCell: ({ naRukiSum }) => <SummaCell summa={naRukiSum} />
  },
  {
    key: 'nachislenieYear',
    header: 'year',
    minWidth: 80
  },
  {
    key: 'nachislenieMonth',
    header: 'month',
    renderCell: (row) => <MonthNameCell monthNumber={row.nachislenieMonth} />,
    minWidth: 100
  },
  {
    key: 'nachislenieSum',
    header: 'summa',
    minWidth: 150,
    renderCell: ({ nachislenieSum }) => <SummaCell summa={nachislenieSum} />
  },
  {
    key: 'uderjanieSum',
    header: 'uderjanie',
    minWidth: 150,
    renderCell: ({ uderjanieSum }) => <SummaCell summa={uderjanieSum} />
  },
  {
    fit: true,
    key: 'total',
    header: 'employee_count',
    minWidth: 100
  }
]
