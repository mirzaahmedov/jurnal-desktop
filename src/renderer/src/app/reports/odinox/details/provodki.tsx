import type { OdinoxTableRow } from './interfaces'
import type { EditableColumnDef } from '@/common/components/editable-table/interface'

import { createTextEditor } from '@/common/components/editable-table/editors'
import { Input } from '@/common/components/ui/input'

export const OdinoxProvodkaColumns: EditableColumnDef<OdinoxTableRow>[] = [
  {
    key: 'smeta_id',
    header: 'id',
    minWidth: 60,
    className: 'font-bold',
    Editor: ({ value }) => {
      return (
        <Input
          readOnly
          editor
          value={typeof value === 'number' && value > 0 ? value : ''}
        />
      )
    }
  },
  {
    key: 'smeta_name',
    header: 'name',
    minWidth: 320,
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
