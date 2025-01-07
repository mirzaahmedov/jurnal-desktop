import {
  createNumberEditor,
  createSmetaGrafikEditor
} from '@/common/features/editable-table/editors'

import type { EditableColumnType } from '@/common/features/editable-table'
import type { RealExpensesReportProvodka } from '../config'

const provodkaColumns: EditableColumnType<RealExpensesReportProvodka>[] = [
  {
    key: 'smeta_grafik_id',
    header: 'Смета',
    Editor: createSmetaGrafikEditor()
  },
  {
    key: 'debet_sum',
    header: 'Дебет',
    Editor: createNumberEditor({ key: 'debet_sum' }),
    width: 320
  },
  {
    key: 'kredit_sum',
    header: 'Кредит',
    Editor: createNumberEditor({ key: 'kredit_sum' }),
    width: 320
  }
]

export { provodkaColumns }
