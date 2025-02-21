import type { ColumnDef } from '@/common/components'
import type { Smeta } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const smetaColumns: ColumnDef<Smeta>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    className: 'w-40',
    headerClassName: 'w-40'
  },
  {
    stretch: true,
    key: 'smeta_name',
    header: 'name'
  },
  {
    key: 'smeta_number',
    header: 'number',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'group_number',
    headerClassName: '!w-32',
    className: '!w-32'
  },
  {
    key: 'father_smeta_name',
    header: 'smeta_base',
    headerClassName: '!w-32',
    className: '!w-32'
  }
]
