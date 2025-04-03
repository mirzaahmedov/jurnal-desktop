import type { KassaOstatok } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@renderer/common/components/table/renderers/summa'

import { type ColumnDef } from '@/common/components'
import { formatLocaleDate } from '@/common/lib/format'

export const kassaOstatokColumns: ColumnDef<KassaOstatok>[] = [
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
    fit: true,
    sort: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    numeric: true,
    header: 'prixod',
    key: 'prixod_summa',
    minWidth: 200,
    renderCell: (row) => (!row.prixod_summa ? '-' : <SummaCell summa={row.prixod_summa} />)
  },
  {
    numeric: true,
    header: 'rasxod',
    key: 'rasxod_summa',
    minWidth: 200,
    renderCell: (row) => (!row.rasxod_summa ? '-' : <SummaCell summa={row.rasxod_summa} />)
  },
  {
    minWidth: 200,
    key: 'provodka',
    renderCell: (row) => <ProvodkaCell provodki={row.provodki_array} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  }
]
