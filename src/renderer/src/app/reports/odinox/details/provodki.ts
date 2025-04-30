import type { OdinoxTableRow } from './interfaces'
import type { EditableColumnDef } from '@/common/components/editable-table/interface'

import { createTextEditor } from '@/common/components/editable-table/editors'

export const OdinoxProvodkaColumns: EditableColumnDef<OdinoxTableRow>[] = [
  {
    key: 'smeta_id',
    header: 'id',
    minWidth: 60,
    className: 'font-bold',
    Editor: createTextEditor({
      key: 'id',
      readOnly: true
    })
  },
  {
    key: 'smeta_name',
    header: 'name',
    minWidth: 300,
    Editor: createTextEditor({
      key: 'name',
      readOnly: true
    })
  },
  {
    key: 'smeta_number',
    minWidth: 100,
    headerClassName: 'sticky left-0 z-50',
    className: 'font-bold sticky left-0 z-10',
    Editor: createTextEditor({
      key: 'number',
      readOnly: true
    })
  }
]
