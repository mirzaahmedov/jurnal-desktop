import type { Group, Pereotsenka } from '@/common/models'

import type { ColumnDef } from '@/common/components'
import type { EditableColumnType } from '@renderer/common/components/editable-table'
import { createNumberEditor } from '@renderer/common/components/editable-table/editors/number'
import { createTextEditor } from '@renderer/common/components/editable-table/editors'

const pereotsenkaColumns: ColumnDef<Pereotsenka>[] = [
  {
    key: 'name',
    header: 'Название'
  },
  {
    key: 'group_name',
    header: 'Группа'
  },
  {
    key: 'pereotsenka_foiz',
    header: 'Переоценка %'
  }
]

const groupColumns: EditableColumnType<
  Omit<Group, 'id'> & Pick<Pereotsenka, 'pereotsenka_foiz' | 'group_jur7_id'>
>[] = [
  {
    key: 'name',
    header: 'Наименования',
    Editor: createTextEditor({ key: 'name', disabled: true })
  },
  {
    key: 'schet',
    header: 'Счет',
    Editor: createTextEditor({ key: 'schet', disabled: true })
  },
  {
    key: 'pereotsenka_foiz',
    header: 'Переоценка %',
    Editor: createNumberEditor({ key: 'pereotsenka_foiz' })
  },
  {
    key: 'provodka_debet',
    header: 'Дебет',
    Editor: createTextEditor({ key: 'provodka_debet', disabled: true })
  },
  {
    key: 'smeta_number',
    header: 'Субсчет',
    Editor: createTextEditor({ key: 'smeta_number', disabled: true })
  },
  {
    key: 'provodka_kredit',
    header: 'Кредит',
    Editor: createTextEditor({ key: 'provodka_kredit', disabled: true })
  }
]

export { pereotsenkaColumns, groupColumns }
