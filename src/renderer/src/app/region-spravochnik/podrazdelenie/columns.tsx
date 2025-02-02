import type { ColumnDef } from '@/common/components'
import type { Podrazdelenie } from '@/common/models'

export const subdivisionColumns: ColumnDef<Podrazdelenie>[] = [
  {
    key: 'name'
  },
  {
    key: 'rayon'
  }
]
