import type { PodotchetSaldoProvodkaFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'

export const getPodochetSaldoProvodkaColumns = (isEditable: boolean) =>
  [
    {
      key: 'name',
      Editor: createTextEditor({
        key: 'name',
        readOnly: true
      })
    },
    {
      key: 'rayon',
      Editor: createTextEditor({
        key: 'rayon',
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
    },
    {
      width: 250,
      key: 'summa',
      Editor: createNumberEditor({
        key: 'summa',
        defaultValue: 0,
        readOnly: true,
        inputProps: {
          allowNegative: true
        }
      })
    }
  ] satisfies EditableColumnDef<PodotchetSaldoProvodkaFormValues>[]
