import type { ColumnDef } from '@/common/components'
import type { Operatsii } from '@/common/models'

const operatsiiColumns: ColumnDef<Operatsii>[] = [
  {
    key: 'name',
    header: 'Название'
  },
  {
    key: 'schet',
    header: 'Счет'
  },
  {
    key: 'sub_schet',
    header: 'Субсчет'
  }
]

export { operatsiiColumns }
