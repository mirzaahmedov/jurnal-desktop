import type { OrganSaldoProvodkaFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'

export const OrganSaldoProvodkaColumns: EditableColumnDef<OrganSaldoProvodkaFormValues>[] = [
  {
    key: 'name',
    Editor: createTextEditor({
      key: 'name',
      readOnly: true
    })
  },
  {
    key: 'prixod',
    Editor: createNumberEditor({
      key: 'prixod',
      defaultValue: 0
    })
  },
  {
    key: 'rasxod',
    Editor: createNumberEditor({
      key: 'rasxod',
      defaultValue: 0
    })
  }
]
