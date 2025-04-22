import type { EditableColumnDef } from '@/common/components/editable-table/interface'

import { createTextEditor } from '@/common/components/editable-table/editors'

export interface OdinoxRow {
  name: string
  number: string
}

export const OdinoxProvodkaColumns: EditableColumnDef<OdinoxRow>[] = [
  {
    key: 'name',
    minWidth: 100,
    headerClassName: 'sticky left-0 z-50',
    className: 'font-bold sticky left-0 z-10',
    Editor: createTextEditor({
      key: 'name',
      readOnly: true
    })
  },
  {
    key: 'number',
    minWidth: 100,
    headerClassName: 'sticky left-0 z-50',
    className: 'font-bold sticky left-0 z-10',
    Editor: createTextEditor({
      key: 'number',
      readOnly: true
    })
  }
]
