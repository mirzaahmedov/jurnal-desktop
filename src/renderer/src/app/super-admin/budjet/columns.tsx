import type { ColumnDef } from '@/common/components'
import type { Budjet } from '@/common/models'

export const budgetColumns: ColumnDef<Budjet>[] = [
  {
    key: 'name',
    header: 'Название'
  }
]
