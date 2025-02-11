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
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof KassaMonitoringType] as string)
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
          schet={row.provodki_array?.[0]?.provodki_schet}
          sub_schet={row.provodki_array?.[0]?.provodki_sub_schet}
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
          schet={row.provodki_array?.[0]?.provodki_schet}
          sub_schet={row.provodki_array?.[0]?.provodki_sub_schet}
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
