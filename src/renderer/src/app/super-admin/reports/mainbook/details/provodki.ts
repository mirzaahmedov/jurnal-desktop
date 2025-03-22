import type { EditableColumnDef } from '@renderer/common/components/editable-table/interface'

import { createTextEditor } from '@renderer/common/components/editable-table/editors'

interface ProvodkaRow {
  schet: string
}

export const provodkiColumns: EditableColumnDef<ProvodkaRow>[] = [
  {
    key: 'schet',
    minWidth: 100,
    Editor: createTextEditor({
      key: 'schet',
      readOnly: true
    })
  }
]
