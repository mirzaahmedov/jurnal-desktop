import type { OrganizationOstatokProvodkaFormValues } from '../service'
import type { EditableColumnType } from '@renderer/common/components/editable-table'

import {
  createOperatsiiEditor,
  createSummaEditor
} from '@renderer/common/components/editable-table/editors'

import { TypeSchetOperatsii } from '@/common/models'

export const podvodkaColumns: EditableColumnType<OrganizationOstatokProvodkaFormValues>[] = [
  {
    key: 'operatsii_id',
    header: 'provodka',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.POKAZAT_USLUGI,
      key: 'operatsii_id'
    })
  },
  {
    key: 'summa',
    Editor: createSummaEditor()
  }
]
