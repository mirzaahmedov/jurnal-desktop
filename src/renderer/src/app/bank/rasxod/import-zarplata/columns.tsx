import type { ColumnDef } from '@renderer/common/components'
import type { Nachislenie, Uderjanie } from '@renderer/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { MonthNameCell } from '@renderer/common/components/table/renderers/month-name'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'

export const nachieslenieColumns: ColumnDef<Nachislenie>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    minWidth: 150
  },
  {
    key: 'tabelDocNum',
    header: 'doc_num',
    minWidth: 160
  },
  {
    key: 'tableDocDate',
    header: 'date',
    width: 100,
    minWidth: 100,
    renderCell: (row) => formatLocaleDate(row.docDate)
  },
  {
    key: 'typeVedomost',
    header: 'type'
  },
  {
    key: 'fio',
    minWidth: 300
  },
  {
    key: 'description',
    header: 'opisanie',
    width: 400,
    minWidth: 400
  },
  {
    key: 'doljnostName',
    header: 'doljnost'
  },
  {
    key: 'zvanieName'
  },
  {
    key: 'kartochka'
  },
  {
    key: 'nachislenieYear',
    header: 'year'
  },
  {
    key: 'nachislenieMonth',
    header: 'month',
    renderCell: (row) => <MonthNameCell monthNumber={row.nachislenieMonth} />
  }
]

export const uderjanieColumns: ColumnDef<Uderjanie>[] = [
  {
    key: 'fio',
    width: 300,
    minWidth: 300
  },
  {
    key: 'rayon',
    width: 400,
    minWidth: 400,
    className: 'text-xs'
  },
  {
    key: 'doljnostName',
    width: 300,
    minWidth: 300,
    header: 'doljnost'
  },
  {
    key: 'dopOplataSumma',
    width: 300,
    minWidth: 300,
    renderCell: (row) => formatNumber(row.dopOplataSumma)
  },
  {
    key: 'nachislenieSumma',
    width: 300,
    minWidth: 300,
    renderCell: (row) => formatNumber(row.dopOplataSumma)
  },
  {
    key: 'uderjanieSumma',
    width: 300,
    minWidth: 300,
    renderCell: (row) => formatNumber(row.dopOplataSumma)
  },
  {
    key: 'naRuki',
    width: 300,
    minWidth: 300
  },
  {
    key: 'kartochka',
    width: 300,
    minWidth: 300
  }
]
