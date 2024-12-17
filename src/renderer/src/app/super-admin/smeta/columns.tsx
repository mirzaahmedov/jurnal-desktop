import type { ColumnDef } from '@/common/components'
import type { Smeta } from '@/common/models'

const smetaColumns: ColumnDef<Smeta>[] = [
  {
    key: 'smeta_name',
    header: 'Название'
  },
  {
    key: 'smeta_number',
    header: 'Номер',
    headerClassName: 'w-20'
  },
  {
    key: 'group_number',
    header: 'Номер группы',
    headerClassName: 'w-20'
  },
  {
    key: 'father_smeta_name',
    header: 'Смета база',
    headerClassName: 'w-20'
  }
]

export { smetaColumns }
