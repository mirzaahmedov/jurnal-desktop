import type { ColumnDef } from '@/common/components'
import type { Log } from '@/common/models'

export const LogColumns: ColumnDef<Log>[] = [
  {
    key: 'id'
  },
  {
    key: 'date',
    header: 'Дата'
  },
  {
    key: 'type',
    header: 'Тип'
  },
  {
    key: 'user_id',
    header: 'Пользователь'
  }
]
