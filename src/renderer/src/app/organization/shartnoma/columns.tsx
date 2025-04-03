import type { Shartnoma } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

import { type ColumnDef } from '@/common/components'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

const ShartnomaSmetaCell = (row: Shartnoma) => {
  return row.grafiks.map((g, i) => (
    <>
      {i !== 0 ? ', ' : null}
      <b className="leading-loose">{g.smeta?.smeta_number}</b>
    </>
  ))
}

export const shartnomaColumns: ColumnDef<Shartnoma>[] = [
  {
    width: 160,
    minWidth: 160,
    key: 'id',
    renderCell: IDCell
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },

  {
    fill: true,
    minWidth: 350,
    key: 'grafiks',
    header: 'smeta',
    renderCell: ShartnomaSmetaCell
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa',
    renderCell: (row) => <b className="font-black">{formatNumber(Number(row.summa))}</b>
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  }
]
