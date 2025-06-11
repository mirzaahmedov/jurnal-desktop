import type { ColumnDef } from '@/common/components'
import type { Distance } from './service'
import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const columnDefs: ColumnDef<Distance>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'from',
    header: 'from_where'
  },
  {
    key: 'to',
    header: 'to_where'
  },
  {
    numeric: true,
    header: 'distance',
    key: 'distance_km',
    renderCell: (row) => <SummaCell summa={row.distance_km} />
  }
]
