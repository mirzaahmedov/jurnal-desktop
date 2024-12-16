import type { ColumnDef } from '@/common/components'
import type { Smeta } from '@/common/models'

const smetaColumns: ColumnDef<Smeta>[] = [
  {
    key: 'smeta_name',
    header: 'Название'
  },
  {
    key: 'smeta_number',
    header: 'Номер'
  },
  {
    key: 'group_number',
    header: 'Номер группы'
  },
  {
    key: 'father_smeta_name',
    header: 'Смета база'
  }
]

export { smetaColumns }
