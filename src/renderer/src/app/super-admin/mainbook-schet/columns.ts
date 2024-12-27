import type { ColumnDef } from '@renderer/common/components'
import type { Mainbook } from '@renderer/common/models'

export const adminMainbookSchetColumns: ColumnDef<Mainbook.Schet>[] = [
  {
    key: 'name',
    header: 'Наименование'
  },
  {
    key: 'schet',
    header: 'Счет'
  }
]
