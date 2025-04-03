import type { ColumnDef } from '@renderer/common/components'
import type { Internal } from '@renderer/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'

export const internalColumns: ColumnDef<Internal>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    fill: true,
    minWidth: 350,
    key: 'kimdan_name',
    header: 'from-who'
  },
  {
    fill: true,
    minWidth: 350,
    key: 'kimga',
    header: 'to-whom',
    renderCell: (row) => row?.kimga?.fio
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa',
    renderCell: (row) => <b className="font-black">{formatNumber(row.summa)}</b>
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  }
]
