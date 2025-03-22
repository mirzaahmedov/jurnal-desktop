import type { MainbookReportProvodkaValues } from '../config'
import type { EditableColumnDef } from '@renderer/common/components/editable-table'

import {
  createMainbookSchetEditor,
  createNumberEditor
} from '@renderer/common/components/editable-table/editors'

const provodkaColumns: EditableColumnDef<MainbookReportProvodkaValues>[] = [
  {
    key: 'spravochnik_main_book_schet_id',
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
