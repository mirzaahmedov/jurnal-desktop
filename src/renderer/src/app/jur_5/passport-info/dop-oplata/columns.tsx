import type { ColumnDef } from '@/common/components'
import type { DopOplata } from '@/common/models/dop-oplata'

import { Trans } from 'react-i18next'

import { SummaCell } from '@/common/components/table/renderers/summa'

export const DopOplataColumnDefs: ColumnDef<DopOplata>[] = [
  {
    key: 'paymentName',
    header: 'payment'
  },
  {
    key: 'from',
    header: 'start_date'
  },
  {
    key: 'to',
    header: 'end_date'
  },
  {
    key: 'day',
    header: 'days'
  },
  {
    key: 'summa',
    renderCell: (row) => <SummaCell summa={row.summa ?? 0} />
  },
  {
    key: 'percentage',
    renderHeader: () => (
      <>
        <Trans>foiz</Trans>(%)
      </>
    )
  }
]
