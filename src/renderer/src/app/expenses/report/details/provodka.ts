import {
  createMainbookSchetEditor,
  createNumberEditor
} from '@/common/features/editable-table/editors'

import type { EditableColumnType } from '@/common/features/editable-table'
import type { MainbookReportProvodka } from '../config'

const provodkaColumns: EditableColumnType<MainbookReportProvodka>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'Подводка',
    Editor: createMainbookSchetEditor()
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
