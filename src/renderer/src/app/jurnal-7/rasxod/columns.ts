import type { ColumnDef } from '@renderer/common/components'
import type { Jur7Rasxod } from '@renderer/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate } from '@renderer/common/lib/format'

export const rasxodColumns: ColumnDef<Jur7Rasxod>[] = [
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
    numeric: true,
    key: 'summa',
    minWidth: 120
  },
  {
    minWidth: 300,
    key: 'opisanie'
  }
]
