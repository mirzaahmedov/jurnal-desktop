import type { ColumnDef } from '@/common/components'
import type { Smeta } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const smetaColumns: ColumnDef<Smeta>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160
  },
  {
    key: 'smeta_name',
    header: 'name'
  },
  {
    key: 'smeta_number',
    header: 'number',
    width: 160
  },
  {
    key: 'group_number',
    width: 160
  },
  {
    key: 'father_smeta_name',
    header: 'smeta_base',
    width: 160
  }
]
