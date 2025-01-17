import type { ColumnDef } from '@/common/components'
import type { Jur7Podrazdelenie } from '@/common/models'

export const subdivision7Columns: ColumnDef<Jur7Podrazdelenie>[] = [
  {
    key: 'name',
    header: 'Наименование'
  }
]
