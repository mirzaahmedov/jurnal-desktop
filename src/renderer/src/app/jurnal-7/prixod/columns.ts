import type { ColumnDef } from '@renderer/common/components'
import type { MO7Prixod } from '@renderer/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate } from '@renderer/common/lib/format'

export const prixodColumns: ColumnDef<MO7Prixod>[] = [
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
    key: 'kimdan_name',
    header: 'from-who',
    minWidth: 300
  },
  {
    key: 'kimga_name',
    header: 'to-whom',
    minWidth: 300
  },
  {
    numeric: true,
    key: 'summa',
    minWidth: 120
  },
  {
    key: 'opisanie',
    minWidth: 300
  }
]
