import type { ColumnDef } from '@/common/components'
import type { SmetaGrafik } from '@/common/models'

import { Trans } from 'react-i18next'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Badge } from '@/common/components/ui/badge'

export const SmetaGrafikColumns: ColumnDef<SmetaGrafik>[] = [
  {
    width: 160,
    minWidth: 160,
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'year'
  },
  {
    key: 'summa',
    renderCell: (row) => <SummaCell summa={row.summa} />
  },
  {
    width: 350,
    key: 'command',
    header: 'decree'
  },
  {
    key: 'order_number',
    header: 'numeric-order',
    renderCell: (row) =>
      row.order_number > 0 ? (
        row.order_number
      ) : (
        <Badge>
          <Trans>main</Trans>
        </Badge>
      )
  }
]
