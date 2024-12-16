import type { Bank } from '@/common/models'
import type { ColumnDef } from '@/common/components'

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
