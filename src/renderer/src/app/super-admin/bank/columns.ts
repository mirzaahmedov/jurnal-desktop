import type { ColumnDef } from '@/common/components'
import type { Bank } from '@/common/models'

const bankColumns: ColumnDef<Bank>[] = [
  {
    key: 'mfo',
    header: 'МФО'
  },
  {
    key: 'bank_name',
    header: 'Название банка'
  }
]

export { bankColumns }
