import type { ColumnDef } from '@/common/components'
import type { PodotchetMonitor } from '@/common/models'

import { ProvodkaBadge } from '@renderer/common/components/provodka-badge'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { formatLocaleDate } from '@/common/lib/format'

export const podotchetMonitoringColumns: ColumnDef<PodotchetMonitor>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    key: 'opisanie'
  },
  {
    numeric: true,
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
    key: 'podotchet_name',
    header: 'podotchet'
  },
  {
    fit: true,
    key: 'type',
    header: 'type-operatsii',
    renderCell: (row) => <ProvodkaBadge type={row.type} />
  },

  {
    key: 'user_id',
    header: 'created-by-user',
    renderCell: (row) => `${row.fio} (@${row.login})`
  }
]
