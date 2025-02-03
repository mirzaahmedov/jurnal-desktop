import type { ColumnDef } from '@/common/components'
import type { Bank } from '@/common/models'

const bankColumns: ColumnDef<Bank>[] = [
  {
    key: 'mfo'
  },
  {
    key: 'bank_name',
    header: 'name'
  }
]

export { bankColumns }
