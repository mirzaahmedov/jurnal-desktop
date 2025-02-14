import type { ShartnomaGrafikFormValues } from '../service'
import type { EditableColumnType } from '@renderer/common/components/editable-table'

import {
  createNumberEditor,
  createSmetaEditor
} from '@renderer/common/components/editable-table/editors'

export const provodkaColumns: EditableColumnType<ShartnomaGrafikFormValues>[] = [
  {
    key: 'smeta_id',
    header: 'smeta',
    Editor: createSmetaEditor()
  },
  {
    key: 'oy_1',
    header: 'january',
    Editor: createNumberEditor({ key: 'oy_1' })
  },
  {
    key: 'oy_2',
    header: 'february',
    Editor: createNumberEditor({ key: 'oy_2' })
  },
  {
    key: 'oy_3',
    header: 'march',
    Editor: createNumberEditor({ key: 'oy_3' })
  },
  {
    key: 'oy_4',
    header: 'april',
    Editor: createNumberEditor({ key: 'oy_4' })
  },
  {
    key: 'oy_5',
    header: 'may',
    Editor: createNumberEditor({ key: 'oy_5' })
  },
  {
    key: 'oy_6',
    header: 'june',
    Editor: createNumberEditor({ key: 'oy_6' })
  },
  {
    key: 'oy_7',
    header: 'july',
    Editor: createNumberEditor({ key: 'oy_7' })
  },
  {
    key: 'oy_8',
    header: 'august',
    Editor: createNumberEditor({ key: 'oy_8' })
  },
  {
    key: 'oy_9',
    header: 'september',
    Editor: createNumberEditor({ key: 'oy_9' })
  },
  {
    key: 'oy_10',
    header: 'october',
    Editor: createNumberEditor({ key: 'oy_10' })
  },
  {
    key: 'oy_11',
    header: 'november',
    Editor: createNumberEditor({ key: 'oy_11' })
  },
  {
    key: 'oy_12',
    header: 'december',
    Editor: createNumberEditor({ key: 'oy_12' })
  }
]
