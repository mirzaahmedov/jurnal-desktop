import type { ColumnDef } from '@renderer/common/components'
import type { InternalTransfer } from '@renderer/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate } from '@renderer/common/lib/format'

export const internalColumns: ColumnDef<InternalTransfer>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    fit: true,
    key: 'doc_num'
  },
  {
    fit: true,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    minWidth: 300,
    key: 'kimdan_name',
    header: 'from-who'
  },
  {
    minWidth: 300,
    key: 'kimga',
    header: 'to-whom',
    renderCell: (row) => row?.kimga?.fio
  },
  {
    numeric: true,
    minWidth: 120,
    key: 'summa'
  },
  {
    minWidth: 300,
    key: 'opisanie'
  }
]
