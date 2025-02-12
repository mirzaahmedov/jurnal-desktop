import type { ColumnDef } from '@/common/components'
import type { Responsible } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'

export const responsibleColumns: ColumnDef<Responsible>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'fio',
    header: 'ФИО'
  },
  {
    key: 'spravochnik_podrazdelenie_jur7_name',
    header: 'Подразделение'
  }
]
