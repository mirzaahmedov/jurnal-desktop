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
    key: 'kassa',
    header: <Trans values={{ nth: 1 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.kassa_count} />
  },
  {
    key: 'bank',
    header: <Trans values={{ nth: 2 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.bank_count} />
  },
  {
    key: 'organization',
    header: <Trans values={{ nth: 3 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.organ_count} />
  },
  {
    key: 'jur7',
    header: <Trans values={{ nth: 7 }}>mo-nth</Trans>,
    renderCell: (row) => <CountCell count={row.counts.jur7_count} />
  },
  {
    key: 'spravochnik',
    header: <Trans ns="app">pages.spravochnik</Trans>,
    renderCell: (row) => <CountCell count={row.counts.storage_count} />
  },
  {
    key: 'total',
    renderCell: (row) => <CountCell count={row.counts.total_count} />
  }
]
