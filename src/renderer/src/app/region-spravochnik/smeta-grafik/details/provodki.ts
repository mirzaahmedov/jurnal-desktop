import type { SmetaGrafikBatchFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { createNumberEditor, createSmetaEditor } from '@/common/components/editable-table/editors'

export const provodki: EditableColumnDef<SmetaGrafikBatchFormValues['smetas'][number]>[] = [
  {
    key: 'smeta_id',
    header: 'smeta',
    Editor: createSmetaEditor()
  },
  {
    key: 'oy_1',
    header: 'january',
    Editor: createNumberEditor({ key: 'oy_1', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_2',
    header: 'february',
    Editor: createNumberEditor({ key: 'oy_2', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_3',
    header: 'march',
    Editor: createNumberEditor({ key: 'oy_3', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_4',
    header: 'april',
    Editor: createNumberEditor({ key: 'oy_4', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_5',
    header: 'may',
    Editor: createNumberEditor({ key: 'oy_5', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_6',
    header: 'june',
    Editor: createNumberEditor({ key: 'oy_6', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_7',
    header: 'july',
    Editor: createNumberEditor({ key: 'oy_7', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_8',
    header: 'august',
    Editor: createNumberEditor({ key: 'oy_8', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_9',
    header: 'september',
    Editor: createNumberEditor({ key: 'oy_9', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_10',
    header: 'october',
    Editor: createNumberEditor({ key: 'oy_10', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_11',
    header: 'november',
    Editor: createNumberEditor({ key: 'oy_11', inputProps: { adjustWidth: true } })
  },
  {
    key: 'oy_12',
    header: 'december',
    Editor: createNumberEditor({ key: 'oy_12', inputProps: { adjustWidth: true } })
  }
]
