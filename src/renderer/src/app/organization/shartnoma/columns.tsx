import type { Shartnoma } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

import { type ColumnDef } from '@/common/components'
import { formatLocaleDate } from '@/common/lib/format'

const ShartnomaSmetaCell = (row: Shartnoma) => {
  return row.grafiks.map((g, i) => (
    <>
      {i !== 0 ? ', ' : null}
      <b>{g.smeta?.smeta_number}</b>
    </>
  ))
}

export const shartnomaColumns: ColumnDef<Shartnoma>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    key: 'grafiks',
    header: 'smeta',
    renderCell: ShartnomaSmetaCell
  },
  {
    key: 'opisanie'
  }
]
