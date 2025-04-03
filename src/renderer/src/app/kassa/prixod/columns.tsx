import type { ColumnDef } from '@/common/components'
import type { KassaPrixod } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<KassaPrixod>[] = [
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
    key: 'summa',
    minWidth: 200,
    renderCell: (row) =>
      !row.summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa}
          provodki={row.provodki_array}
        />
      )
  },
  {
    fill: true,
    minWidth: 350,
    key: 'spravochnik_podotchet_litso_name',
    header: 'podotchet-litso'
  }
]
