import type { ColumnDef } from '@/common/components'
import type { KassaMonitoringType } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@renderer/common/components/table/renderers/summa'
import { UserCell } from '@renderer/common/components/table/renderers/user'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaMonitoringType>[] = [
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
    fit: true,
    sort: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    fill: true,
    key: 'opisanie',
    minWidth: 350
  },
  {
    numeric: true,
    key: 'prixod_sum',
    header: 'prixod',
    minWidth: 200,
    renderCell: (row) => (!row.prixod_sum ? '-' : <SummaCell summa={row.prixod_sum} />)
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    header: 'rasxod',
    minWidth: 200,
    renderCell: (row) => (!row.rasxod_sum ? '-' : <SummaCell summa={row.rasxod_sum} />)
  },
  {
    minWidth: 200,
    key: 'provodka',
    renderCell: (row) => <ProvodkaCell provodki={row.provodki_array} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
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
