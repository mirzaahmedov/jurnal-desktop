import type { ColumnDef } from '@/common/components'
import type { Responsible } from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'

export const ResponsibleColumns: ColumnDef<Responsible>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160
  },
  {
    key: 'fio'
  },
  {
    key: 'spravochnik_podrazdelenie_jur7_name',
    header: 'podrazdelenie'
  }
]
