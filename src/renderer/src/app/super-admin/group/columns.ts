import type { ColumnDef } from '@/common/components'
import type { PathTreeNode } from '@/common/lib/tree/path-tree'
import type { Group } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const groupColumns: ColumnDef<PathTreeNode<Group>>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160
  },
  {
    key: 'name'
  },
  {
    key: 'schet',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'iznos_foiz',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'provodka_debet',
    header: 'debet',
    headerClassName: 'w-32',
    className: 'w-32',
    renderCell: (row) => {
      return row.provodka_debet ?? ''
    }
  },
  {
    key: 'provodka_subschet',
    header: 'subschet',
    headerClassName: 'w-32',
    className: 'w-32',
    renderCell: (row) => {
      return row.provodka_subschet ?? ''
    }
  },
  {
    key: 'provodka_kredit',
    header: 'kredit',
    headerClassName: 'w-32',
    className: 'w-32',
    renderCell: (row) => {
      return row.provodka_kredit ?? ''
    }
  },
  {
    key: 'group_number',
    className: 'w-32',
    renderCell: (row) => {
      return row.group_number ?? ''
    }
  },
  {
    key: 'pod_group',
    className: 'w-32'
  }
]
