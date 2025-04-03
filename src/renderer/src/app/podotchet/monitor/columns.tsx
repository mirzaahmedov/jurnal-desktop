import type { PodotchetMonitor } from '@/common/models'

import { DataList } from '@renderer/common/components/data-list'
import { ProvodkaBadge } from '@renderer/common/components/provodka-badge'
import { HoverInfoCell } from '@renderer/common/components/table/renderers'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { UserCell } from '@renderer/common/components/table/renderers/user'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { formatLocaleDate } from '@/common/lib/format'

export const podotchetMonitoringColumns: ColumnDef<PodotchetMonitor>[] = [
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
      return row.prixod_sum ? (
        <ProvodkaCell
          summa={row.prixod_sum}
          provodki={[
            {
              provodki_schet: row.provodki_schet,
              provodki_sub_schet: row.provodki_sub_schet
            }
          ]}
        />
      ) : (
        '-'
      )
    }
  },
  {
    numeric: true,
    minWidth: 200,
    header: 'kredit',
    key: 'rasxod_sum',
    renderCell(row) {
      return row.rasxod_sum ? (
        <ProvodkaCell
          summa={row.rasxod_sum}
          provodki={[
            {
              provodki_schet: row.provodki_schet,
              provodki_sub_schet: row.provodki_sub_schet
            }
          ]}
        />
      ) : (
        '-'
      )
    }
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
