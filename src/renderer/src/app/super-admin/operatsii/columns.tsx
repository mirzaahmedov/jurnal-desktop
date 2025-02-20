import type { ColumnDef } from '@/common/components'
import type { Operatsii } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

import { operatsiiTypeSchetOptions } from './config'

export const operatsiiColumns: ColumnDef<Operatsii>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name'
  },
  {
    key: 'schet'
  },
  {
    key: 'type_schet',
    renderCell: (row) => {
      return operatsiiTypeSchetOptions.find((o) => o.value === row.type_schet)?.label ?? '-'
    }
  },
  {
    key: 'sub_schet',
    header: 'subschet'
  }
]
