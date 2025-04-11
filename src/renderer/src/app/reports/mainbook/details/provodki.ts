import type { EditableColumnDef } from '@/common/components/editable-table/interface'

import { createTextEditor } from '@/common/components/editable-table/editors'

export interface ProvodkaRow {
  schet: string
}

export const MainbookProvodkaColumns: EditableColumnDef<ProvodkaRow>[] = [
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
