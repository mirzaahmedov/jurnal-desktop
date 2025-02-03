import type { ColumnDef } from '@/common/components'
import type { Group, Pereotsenka } from '@/common/models'
import type { EditableColumnType } from '@renderer/common/components/editable-table'

import { createTextEditor } from '@renderer/common/components/editable-table/editors'
import { createNumberEditor } from '@renderer/common/components/editable-table/editors/number'

const pereotsenkaColumns: ColumnDef<Pereotsenka>[] = [
  {
    key: 'name'
  },
  {
    key: 'group_name',
    header: 'group'
  },
  {
    key: 'pereotsenka_foiz'
  }
]

const groupColumns: EditableColumnType<
  Omit<Group, 'id'> & Pick<Pereotsenka, 'pereotsenka_foiz' | 'group_jur7_id'>
>[] = [
  {
    key: 'name',
    Editor: createTextEditor({ key: 'name', disabled: true })
  },
  {
    key: 'schet',
    Editor: createTextEditor({ key: 'schet', disabled: true })
  },
  {
    key: 'pereotsenka_foiz',
    Editor: createNumberEditor({ key: 'pereotsenka_foiz' })
  },
  {
    key: 'provodka_debet',
    header: 'debet',
    Editor: createTextEditor({ key: 'provodka_debet', disabled: true })
  },
  {
    key: 'smeta_number',
    header: 'subschet',
    Editor: createTextEditor({ key: 'smeta_number', disabled: true })
  },
  {
    key: 'provodka_kredit',
    header: 'kredit',
    Editor: createTextEditor({ key: 'provodka_kredit', disabled: true })
  }
]

export { pereotsenkaColumns, groupColumns }
