import { createNumberEditor, createSmetaEditor } from '@/common/features/editable-table/editors'

import type { EditableColumnType } from '@/common/features/editable-table'
import type { ExpensesReportProvodka } from '../config'

const provodkaColumns: EditableColumnType<ExpensesReportProvodka>[] = [
  {
    key: 'smeta_id',
    header: 'Смета',
    Editor: createSmetaEditor()
  },
  {
    key: 'debet_sum',
    header: 'Дебет',
    Editor: createNumberEditor({ key: 'debet_sum' })
  },
  {
    key: 'kredit_sum',
    header: 'Кредит',
    Editor: createNumberEditor({ key: 'kredit_sum' })
  }
]

export { provodkaColumns }
