import type { ColumnDef } from '@renderer/common/components'
import type { Log } from '@renderer/common/models'

const logColumns: ColumnDef<Log>[] = [
  {
    key: 'id',
    header: 'Идентификатор'
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

export { logColumns }
