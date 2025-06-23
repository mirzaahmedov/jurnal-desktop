import type { ColumnDef } from '@/common/components'
import type { MaterialRasxod } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

import { ExpandableProvodka } from '../__components__/expandable-provodka'

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
    key: 'childs',
    header: 'provodka',
    minWidth: 350,
    renderCell: (row) => {
      return <ExpandableProvodka row={row} />
    }
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
