import type { ColumnDef } from '@/common/components'
import type { OtherVedemost } from '@/common/models'

import { t } from 'i18next'

import { SummaCell } from '@/common/components/table/renderers/summa'

export const NachislenieOthersColumnDefs: ColumnDef<OtherVedemost>[] = [
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
    key: 'type',
    renderCell: (row) => t(row.type)
  },
  {
    key: 'paymentType',
    header: 'payment_type',
    renderCell: (row) => t(row.paymentType)
  },
  {
    key: 'amount',
    renderCell: (row) => <SummaCell summa={row.amount} />
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
