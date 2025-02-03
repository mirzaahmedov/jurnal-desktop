import type { ColumnDef } from '@renderer/common/components'
import type { RegionData } from '@renderer/common/models'

import { Badge } from '@renderer/common/components/ui/badge'

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

const regionDataColumns: ColumnDef<RegionData>[] = [
  {
    key: 'name'
  },
  {
    key: 'kassa',
    header: 'mo-1',
    renderCell: (row) => <CountCell count={row.counts.kassa_count} />
  },
  {
    key: 'bank',
    header: 'mo-2',
    renderCell: (row) => <CountCell count={row.counts.bank_count} />
  },
  {
    key: 'organization',
    header: 'mo-3',
    renderCell: (row) => <CountCell count={row.counts.organ_count} />
  },
  {
    key: 'jur7',
    header: 'mo-7',
    renderCell: (row) => <CountCell count={row.counts.jur7_count} />
  },
  {
    key: 'spravochnik',
    renderCell: (row) => <CountCell count={row.counts.storage_count} />
  },
  {
    key: 'total',
    renderCell: (row) => <CountCell count={row.counts.total_count} />
  }
]

export { regionDataColumns }
