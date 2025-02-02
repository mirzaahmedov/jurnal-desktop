import type { RealExpensesReportProvodka } from '../config'
import type { EditableColumnType } from '@renderer/common/components/editable-table'

import {
  createNumberEditor,
  createSmetaGrafikEditor
} from '@renderer/common/components/editable-table/editors'

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
