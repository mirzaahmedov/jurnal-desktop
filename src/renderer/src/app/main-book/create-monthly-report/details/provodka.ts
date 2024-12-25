import { createNumberEditor, createOperatsiiEditor } from '@/common/features/editable-table/editors'

import type { EditableColumnType } from '@/common/features/editable-table'
import type { OpenMonthlyReportProvodka } from '../config'
import { TypeSchetOperatsii } from '@/common/models'

const provodkaColumns: EditableColumnType<OpenMonthlyReportProvodka>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'Подводка',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.BANK_PRIXOD
    })
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
