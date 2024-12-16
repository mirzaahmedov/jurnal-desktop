import type { ColumnDef } from '@/common/components'
import type { Responsible } from '@/common/models'

export const responsibleColumns: ColumnDef<Responsible>[] = [
  {
    key: 'fio',
    header: 'ФИО'
  },
  {
    key: 'spravochnik_podrazdelenie_jur7_name',
    header: 'Подразделение'
  }
]
