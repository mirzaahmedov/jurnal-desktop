import type { SmetaGrafikProvodkaFormValue } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { createNumberEditor, createSmetaEditor } from '@/common/components/editable-table/editors'

export const provodki: EditableColumnDef<SmetaGrafikProvodkaFormValue>[] = [
  {
    key: 'smeta_id',
    header: 'smeta',
    Editor: createSmetaEditor()
  },
  {
    key: 'oy_1',
    header: 'january',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_1', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_2',
    header: 'february',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_2', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_3',
    header: 'march',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_3', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_4',
    header: 'april',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_4', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_5',
    header: 'may',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_5', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_6',
    header: 'june',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_6', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_7',
    header: 'july',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_7', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_8',
    header: 'august',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_8', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_9',
    header: 'september',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_9', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_10',
    header: 'october',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_10', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_11',
    header: 'november',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_11', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_12',
    header: 'december',
    headerClassName: 'text-end',
    Editor: createNumberEditor({ key: 'oy_12', inputProps: { adjustWidth: true } })
  },
  {
    key: 'total',
    header: 'total',
    headerClassName: 'text-end',
    Editor: createNumberEditor({
      key: 'total',
      inputProps: {
        adjustWidth: true,
        readOnly: true
      }
    })
  }
]
