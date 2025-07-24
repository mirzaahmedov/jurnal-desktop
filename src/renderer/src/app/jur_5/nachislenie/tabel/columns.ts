import type { ColumnDef } from '@/common/components'
import type { Tabel } from '@/common/models/tabel'

export const TabelColumnDefs: ColumnDef<Tabel>[] = [
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
