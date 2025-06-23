import type { ColumnDef } from '@/common/components'
import type { MO7Prixod } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export const prixodColumns: ColumnDef<MO7Prixod>[] = [
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
    fill: true,
    minWidth: 350,
    key: 'kimga_name',
    header: 'to-whom'
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
  },
  {
    fit: true,
    key: 'user_id',
    minWidth: 200,
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        id={row.user_id}
        fio={row.fio}
        login={row.login}
      />
    )
  }
]
