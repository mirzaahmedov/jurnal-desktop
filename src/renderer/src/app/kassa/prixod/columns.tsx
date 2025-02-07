import type { ColumnDef } from '@/common/components'
import type { KassaPrixodType } from '@/common/models'

import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaPrixodType>[] = [
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof KassaPrixodType] as string)
    }
  },
  {
    key: 'opisanie'
  },
  {
    numeric: true,
    key: 'summa',
    renderCell(row) {
      return !row.summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa}
          schet={row.provodki_array?.[0]?.provodki_schet}
          sub_schet={row.provodki_array?.[0]?.provodki_sub_schet}
        />
      )
    }
  },
  {
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
  }
]
