import type { ColumnDef } from '@/common/components'
import type { Tabel } from '@/common/models/tabel'

import { IDCell } from '@/common/components/table/renderers/id'

export const TabelColumnDefs: ColumnDef<Tabel>[] = [
  {
    key: 'id',
    width: 160,
    minWidth: 160,
    renderCell: IDCell
  },
  {
    key: 'docNum',
    header: 'doc_num'
  },
  {
    key: 'docDate',
    header: 'doc_date'
  },
  {
    key: 'tabelYear',
    header: 'year'
  },
  {
    key: 'tabelMonth',
    header: 'month'
  }
]
