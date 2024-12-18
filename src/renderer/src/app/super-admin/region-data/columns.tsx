import { Badge } from '@renderer/common/components/ui/badge'
import type { ColumnDef } from '@renderer/common/components'
import type { RegionData } from '@renderer/common/models'

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
    key: 'name',
    header: 'Название региона'
  },
  {
    key: 'kassa',
    header: '№1 - МО (Касса)',
    renderCell: (row) => <CountCell count={row.counts.kassa_count} />
  },
  {
    key: 'bank',
    header: '№2 - МО (Банк)',
    renderCell: (row) => <CountCell count={row.counts.bank_count} />
  },
  {
    key: 'organization',
    header: '№3 - МО (Организация)',
    renderCell: (row) => <CountCell count={row.counts.organ_count} />
  },
  {
    key: 'jur7',
    header: '№7 - МО (Материальный склад)',
    renderCell: (row) => <CountCell count={row.counts.jur7_count} />
  },
  {
    key: 'total',
    header: 'Итого',
    renderCell: (row) => <CountCell count={row.counts.total_count} />
  }
]

export { regionDataColumns }
