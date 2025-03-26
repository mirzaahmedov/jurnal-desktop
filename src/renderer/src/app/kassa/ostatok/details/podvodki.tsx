import type { KassaOstatokProvodkaFormValues } from '../service'
import type { EditableColumnDef } from '@renderer/common/components/editable-table'

import {
  createOperatsiiEditor,
  createPodrazdelenieEditor,
  createStaffEditor,
  createSummaEditor,
  createTypeOperatsiiEditor
} from '@renderer/common/components/editable-table/editors'
import { TypeSchetOperatsii } from '@renderer/common/models'

export const provodkaColumns: EditableColumnDef<KassaOstatokProvodkaFormValues>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'provodka',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.GENERAL,
      field: 'spravochnik_operatsii_id'
    })
  },
  {
    key: 'summa',
    Editor: createSummaEditor()
  },
  {
    key: 'id_spravochnik_type_operatsii',
    header: 'type-operatsii',
    Editor: createTypeOperatsiiEditor()
  },
  {
    key: 'id_spravochnik_sostav',
    header: 'sostav',
    Editor: createStaffEditor()
  },
  {
    key: 'id_spravochnik_podrazdelenie',
    header: 'podrazdelenie',
    Editor: createPodrazdelenieEditor()
  }
]
