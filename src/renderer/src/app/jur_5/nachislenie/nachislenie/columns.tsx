import type { ColumnDef } from '@/common/components'
import type { Nachislenie, NachislenieSostav } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const NachislenieSostavColumns: ColumnDef<NachislenieSostav>[] = [
  {
    key: 'id',
    width: 160,
    minWidth: 160,
    renderCell: IDCell
  },
  {
    key: 'foiz',
    width: 100
  },
  {
    key: 'summa',
    width: 250
  },
  {
    key: 'nachislenieName',
    header: 'nachislenie'
  },
  {
    key: 'nachislenieTypeCode',
    header: 'type',
    width: 200
  }
]

export const NachislenieColumns: ColumnDef<Nachislenie>[] = [
  {
    key: 'id',
    width: 160,
    minWidth: 160,
    renderCell: IDCell
  },
  {
    key: 'docNum',
    header: 'doc_num',
    width: 150,
    minWidth: 150
  },
  {
    key: 'docDate',
    header: 'doc_date',
    minWidth: 150
  },
  {
    key: 'nachislenieYear',
    header: 'year',
    minWidth: 150
  },
  {
    key: 'nachislenieMonth',
    header: 'month',
    minWidth: 200
  },
  {
    key: 'nachislenieSum',
    header: 'summa',
    minWidth: 150,
    renderCell: ({ nachislenieSum }) => <SummaCell summa={nachislenieSum} />
  },
  {
    key: 'uderjanieSum',
    header: 'uderjanie',
    minWidth: 150,
    renderCell: ({ uderjanieSum }) => <SummaCell summa={uderjanieSum} />
  },
  {
    key: 'total',
    header: 'total',
    minWidth: 150
  }
]
