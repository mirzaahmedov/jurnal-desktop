import type { ColumnDef } from '@/common/components'
import type { TypeOperatsii } from '@/common/models'

export const operationTypeColumns: ColumnDef<TypeOperatsii>[] = [
  {
    key: 'name',
    header: 'Название'
  },
  {
    key: 'rayon',
    header: 'Район'
  }
]
