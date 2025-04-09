import type { PodotchetMonitor } from '@/common/models'

import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { ProvodkaBadge } from '@/common/components/provodka-badge'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { UserCell } from '@/common/components/table/renderers/user'
import { formatLocaleDate } from '@/common/lib/format'

export const PodotchetMonitorColumns: ColumnDef<PodotchetMonitor>[] = [
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
    key: 'podotchet_name',
    header: 'podotchet-litso',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.podotchet_name}
        secondaryText={row.podotchet_rayon}
        hoverContent={
          <DataList
            list={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.podotchet_id}
                  >
                    #{row.podotchet_id}
                  </Copyable>
                )
              },
              {
                name: <Trans>name</Trans>,
                value: row.podotchet_name
              },
              {
                name: <Trans>rayon</Trans>,
                value: row.podotchet_rayon
              }
            ]}
          />
        }
      />
    )
  },
  {
    numeric: true,
    minWidth: 200,
    header: 'debet',
    key: 'prixod_sum',
    renderCell(row) {
      return row.prixod_sum ? <SummaCell summa={row.prixod_sum} /> : '-'
    }
  },
  {
    numeric: true,
    minWidth: 200,
    header: 'kredit',
    key: 'rasxod_sum',
    renderCell(row) {
      return row.rasxod_sum ? <SummaCell summa={row.rasxod_sum} /> : '-'
    }
  },
  {
    minWidth: 200,
    key: 'provodka',
    renderCell: (row) => (
      <ProvodkaCell
        provodki={[
          {
            provodki_schet: row.provodki_schet,
            provodki_sub_schet: row.provodki_sub_schet
          }
        ]}
      />
    )
  },
  {
    fit: true,
    key: 'type',
    header: 'type-operatsii',
    renderCell: (row) => <ProvodkaBadge type={row.type} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  },
  {
    fit: true,
    key: 'user_id',
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
