import type { BankOstatok } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { type ColumnDef } from '@/common/components'
import { formatLocaleDate } from '@/common/lib/format'

export const bankOstatokColumns: ColumnDef<BankOstatok>[] = [
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
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    numeric: true,
    header: 'prixod',
    key: 'prixod_summa',
    renderCell: (row) =>
      !row.prixod_summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.prixod_summa}
          provodki={row.provodki_array}
        />
      )
  },
  {
    numeric: true,
    header: 'rasxod',
    key: 'rasxod_summa',
    renderCell: (row) =>
      !row.rasxod_summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.rasxod_summa}
          provodki={row.provodki_array}
        />
      )
  },
  {
    width: 350,
    key: 'opisanie'
  }
]
