import type { ColumnDef } from '@/common/components'
import type { Jur7Monitoring } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<Jur7Monitoring>[] = [
  {
    sort: true,
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    fit: true,
    sort: true,
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
    minWidth: 200,
    key: 'summa_prixod',
    header: 'prixod',
    renderCell: (row) => <SummaCell summa={row.summa_prixod} />
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa_rasxod',
    header: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.summa_rasxod} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'from_name',
    header: 'from-who'
  },
  {
    fill: true,
    minWidth: 350,
    key: 'to_name',
    header: 'to-whom'
  },
  {
    key: 'debet',
    headerClassName: 'py-1 text-center',
    columns: [
      {
        key: 'debet_schet',
        header: 'schet',
        headerClassName: 'py-1'
      },
      {
        key: 'debet_sub_schet',
        header: 'subschet',
        headerClassName: 'py-1'
      }
    ]
  },
  {
    key: 'kredit',
    headerClassName: 'py-1 text-center',
    columns: [
      {
        key: 'kredit_schet',
        header: 'schet',
        headerClassName: 'py-1'
      },
      {
        key: 'kredit_sub_schet',
        header: 'subschet',
        headerClassName: 'py-1'
      }
    ]
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  }
]
