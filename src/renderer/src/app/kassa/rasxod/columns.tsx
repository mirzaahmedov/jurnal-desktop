import type { ColumnDef } from '@/common/components'
import type { KassaRasxodType } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaRasxodType>[] = [
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
    key: 'summa',
    renderCell(row) {
      return !row.summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa}
          provodki={row.provodki_array}
        />
      )
    }
  },
  {
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
  }
]
