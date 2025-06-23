import type { ColumnDef } from '@/common/components'
import type { KassaPrixod } from '@/common/models'

import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { UserCell } from '@/common/components/table/renderers/user'
import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaPrixod>[] = [
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
    numeric: true,
    key: 'summa',
    minWidth: 200,
    renderCell: (row) => (!row.summa ? '-' : <SummaCell summa={Number(row.summa)} />)
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
    fill: true,
    minWidth: 350,
    key: 'organization_name',
    header: 'organization',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.organization_name}
        secondaryText={row.organization_inn}
      />
    )
  },
  {
    fill: true,
    key: 'opisanie',
    minWidth: 350
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
