import type { ColumnDef } from '@/common/components'
import type { NachislenieOthers } from '@/common/models'

export const NachislenieOthersColumnDefs: ColumnDef<NachislenieOthers>[] = [
  {
    key: 'docNum',
    header: 'doc_num'
  },
  {
    key: 'docDate',
    header: 'doc_date'
  },
  {
    key: 'nachislenieYear',
    header: 'year'
  },
  {
    key: 'nachislenieMonth',
    header: 'month'
  },
  {
    key: 'type'
  },
  {
    key: 'amount',
    header: 'summa'
  },
  {
    key: 'givenDocDate',
    header: 'given_doc_date'
  },
  {
    key: 'description',
    header: 'opisanie'
  }
]
