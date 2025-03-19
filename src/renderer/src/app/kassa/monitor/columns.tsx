import type { ColumnDef } from '@/common/components'
import type { KassaMonitoringType } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { UserCell } from '@renderer/common/components/table/renderers/user'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaMonitoringType>[] = [
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
    renderCell(row) {
      return formatLocaleDate(row.doc_date)
    }
  },
  {
    width: 350,
    key: 'opisanie'
  },
  {
    numeric: true,
    key: 'prixod_sum',
    header: 'prixod',
    renderCell(row) {
      return !row.prixod_sum ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.prixod_sum}
          provodki={row.provodki_array}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    header: 'rasxod',
    renderCell(row) {
      return !row.rasxod_sum ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.rasxod_sum}
          provodki={row.provodki_array}
        />
      )
    }
  },
  {
    width: 350,
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
  },
  {
    fit: true,
    key: 'user_id',
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        fio={row.fio}
        login={row.login}
      />
    )
  }
]
