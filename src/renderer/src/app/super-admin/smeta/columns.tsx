import type { ColumnDef } from '@/common/components'
import type { Smeta } from '@/common/models'
import type { TreeNode } from '@renderer/common/lib/data-structure'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const smetaColumns: ColumnDef<TreeNode<Smeta>>[] = [
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
