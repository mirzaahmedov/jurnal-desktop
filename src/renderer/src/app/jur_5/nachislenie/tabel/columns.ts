import type { ColumnDef } from '@/common/components'
import type { Tabel } from '@/common/models/tabel'

import { SelectCell } from '@/common/components/table/renderers/select'

export const TabelColumnDefs: ColumnDef<Tabel>[] = [
  {
    key: 'id',
    header: ' ',
    width: 50,
    maxWidth: 50,
    renderCell: SelectCell
  },
  {
    key: 'docNum',
    header: 'doc_num',
    width: 200
  },
  {
    key: 'docDate',
    header: 'doc_date',
    width: 200
  },
  {
    key: 'tabelYear',
    header: 'year',
    width: 200
  },
  {
    key: 'tabelMonth',
    header: 'month',
    width: 200
  }
]
