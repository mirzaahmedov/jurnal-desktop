import type { ColumnDef } from '@/common/components'
import type { Smeta } from '@/common/models'

const smetaColumns: ColumnDef<Smeta>[] = [
  {
    key: 'id'
  },
  {
    key: 'smeta_name',
    header: 'name'
  },
  {
    key: 'smeta_number',
    header: 'number',
    headerClassName: 'w-24',
    className: 'w-32'
  },
  {
    key: 'group_number',
    headerClassName: 'w-24',
    className: 'w-32'
  },
  {
    key: 'father_smeta_name',
    header: 'smeta_base',
    headerClassName: 'w-24',
    className: 'w-32'
  }
]

export { smetaColumns }
