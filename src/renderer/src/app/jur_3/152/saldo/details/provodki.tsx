import type { OrganSaldoProvodkaFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'

export const getOrganSaldoProvodkaColumns = (isEditable: boolean) =>
  [
    {
      key: 'name',
      Editor: createTextEditor({
        key: 'name',
        readOnly: true
      })
    },
    {
      key: 'bank_klient',
      header: 'bank',
      Editor: createTextEditor({
        key: 'bank_klient',
        readOnly: true
      })
    },
    {
      width: 100,
      key: 'mfo',
      Editor: createTextEditor({
        key: 'mfo',
        readOnly: true
      })
    },
    {
      width: 160,
      key: 'inn',
      Editor: createTextEditor({
        key: 'inn',
        readOnly: true
      })
    },
    {
      width: 250,
      key: 'prixod',
      Editor: createNumberEditor({
        key: 'prixod',
        defaultValue: 0,
        readOnly: !isEditable
      })
    },
    {
      width: 250,
      key: 'rasxod',
      Editor: createNumberEditor({
        key: 'rasxod',
        defaultValue: 0,
        readOnly: !isEditable
      })
    }
  ] satisfies EditableColumnDef<OrganSaldoProvodkaFormValues>[]
