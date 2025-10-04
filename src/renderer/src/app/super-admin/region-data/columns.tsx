import type { ColumnDef } from '@/common/components'
import type { RegionData } from '@/common/models'

import { Trans } from 'react-i18next'

import { Badge } from '@/common/components/ui/badge'

const CountCell = ({ count }: { count: number }) => {
  if (Number(count) < 10) {
    return (
      <Badge
        variant="secondary"
        className="bg-red-50 text-red-500"
      >
        {count}
      </Badge>
    )
  }
  return (
    <Badge
      variant="secondary"
      className="bg-green-50 text-green-500"
    >
      {count}
    </Badge>
  )
}

export const RegionDataColumns: ColumnDef<RegionData>[] = [
  {
    key: 'name'
  },
  {
    key: 'order_1',
    header: <Trans values={{ nth: 1 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.order_1} />
  },
  {
    key: 'order_2',
    header: <Trans values={{ nth: 2 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.order_2} />
  },
  {
    key: 'order_5',
    header: <Trans values={{ nth: 5 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.order_5} />
  },
  {
    key: 'order_3',
    header: <Trans values={{ nth: 6 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.order_3} />
  },
  {
    key: 'order_4',
    header: <Trans values={{ nth: 8 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.order_4} />
  },
  {
    key: 'order_7',
    header: <Trans values={{ nth: 9 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.order_7} />
  },
  {
    key: 'spravochnik',
    header: <Trans ns="app">pages.spravochnik</Trans>,
    renderCell: (row) => <CountCell count={row.counts.storage} />
  },
  {
    key: 'total',
    renderCell: (row) => <CountCell count={row.counts.all} />
  }
]
