import { formatLocaleDate, formatNumber } from '@/common/lib/format'

import type { ColumnDef } from '@/common/components'
import { IDCell } from '@/common/components/table/renderers/id'
import type { MaterialRasxod } from '@/common/models'

export const rasxodColumns: ColumnDef<MaterialRasxod>[] = [
  {
    sort: true,
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
