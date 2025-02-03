import type { ColumnDef } from '@/common/components'
import type { Group } from '@/common/models'

export const groupColumns: ColumnDef<Group>[] = [
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
    className: 'w-32'
  },
  {
    key: 'provodka_subschet',
    header: 'subschet',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'provodka_kredit',
    header: 'kredit',
    headerClassName: 'w-32',
    className: 'w-32'
  },
  {
    key: 'group_number',
    className: 'w-32'
  },
  {
    key: 'pod_group',
    className: 'w-32'
  }
]
