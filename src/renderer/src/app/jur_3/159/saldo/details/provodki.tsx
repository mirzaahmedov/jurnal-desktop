import type { EditableColumnDef } from '@/common/components/editable-table'
import type { OrganSaldoProvodka } from '@/common/models'

import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'

export const MainbookProvodkaColumns: EditableColumnDef<OrganSaldoProvodka>[] = [
  {
    key: 'name',
    Editor: createTextEditor({
      key: 'name'
    })
  },
  {
    key: 'prixod',
    Editor: createNumberEditor({
      key: 'prixod'
    })
  },
  {
    key: 'rasxod',
    Editor: createNumberEditor({
      key: 'rasxod'
    })
  }
]
