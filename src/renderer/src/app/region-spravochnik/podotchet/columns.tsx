import type { ColumnDef } from '@/common/components'
import type { Podotchet } from '@/common/models'

export const podotchetColumns: ColumnDef<Podotchet>[] = [
  {
    key: 'name',
    header: 'Название'
  },
  {
    key: 'rayon',
    header: 'Район'
  }
]
