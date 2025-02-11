import type { ColumnDef } from '@renderer/common/components'
import type { Log } from '@renderer/common/models'

export const logColumns: ColumnDef<Log>[] = [
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
