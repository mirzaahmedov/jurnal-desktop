import type { EditableColumnDef } from '@renderer/common/components/editable-table/interface'

import { createTextEditor } from '@renderer/common/components/editable-table/editors'

interface ProvodkaRow {
  schet: string
}

export const provodkiColumns: EditableColumnDef<ProvodkaRow>[] = [
  {
    key: 'schet',
    minWidth: 100,
    headerClassName: 'sticky left-0 z-50',
    className: 'font-bold sticky left-0 bg-background z-10',
    Editor: createTextEditor({
      key: 'schet',
      readOnly: true
    })
  }
]
