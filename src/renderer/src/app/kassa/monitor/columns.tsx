import type { ColumnDef } from '@/common/components'
import type { KassaMonitoringType } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaMonitoringType>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell(row) {
      return formatLocaleDate(row.doc_date)
    }
  },
  {
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
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
  },
  {
    key: 'user_id',
    header: 'created-by-user',
    renderCell(row) {
      return `${row.fio} (@${row.login})`
    }
  }
]
