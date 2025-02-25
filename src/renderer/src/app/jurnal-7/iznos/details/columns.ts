import type { IznosProductFormValues } from './config'
import type { EditableColumnType } from '@renderer/common/components/editable-table'

import { createNumberEditor } from '@renderer/common/components/editable-table/editors'

export const provodkaColumns: EditableColumnType<IznosProductFormValues>[] = [
  {
    key: 'name',
    header: 'name',
    Editor: createNumberEditor({ key: 'name' })
  },
  {
    key: 'group_name',
    header: 'group',
    Editor: createNumberEditor({ key: 'group_name' })
  },
  {
    key: 'iznos_foiz',
    header: 'iznos',
    Editor: createNumberEditor({ key: 'iznos_foiz' })
  },
  {
    key: 'serial_num',
    header: 'serial_num',
    Editor: createNumberEditor({ key: 'serial_num' })
  },
  {
    key: 'inventar_num',
    header: 'inventar_num',
    Editor: createNumberEditor({ key: 'inventar_num' })
  },
  {
    key: 'eski_iznos_summa',
    header: 'eski_iznos_summa',
    Editor: createNumberEditor({ key: 'eski_iznos_summa' })
  },
  {
    key: 'new_summa',
    header: 'new_summa',
    Editor: createNumberEditor({ key: 'new_summa' })
  }
]
