import type { ColumnDef } from '@/common/components'
import type { Operatsii } from '@/common/models'

const operatsiiColumns: ColumnDef<Operatsii>[] = [
  {
    key: 'name'
  },
  {
    key: 'schet'
  },
  {
    key: 'sub_schet',
    header: 'subschet'
  }
]

export { operatsiiColumns }
