import type { OrganSaldoProvodkaFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'

export const OrganSaldoProvodkaColumns: EditableColumnDef<OrganSaldoProvodkaFormValues>[] = [
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
