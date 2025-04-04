import type { AdvanceReportPodvodkaPayloadType } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import {
  createOperatsiiEditor,
  createPodrazdelenieEditor,
  createStaffEditor,
  createSummaEditor,
  createTypeOperatsiiEditor
} from '@/common/components/editable-table/editors'
import { TypeSchetOperatsii } from '@/common/models'

export const podvodkaColumns: EditableColumnDef<AdvanceReportPodvodkaPayloadType>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'provodka',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.AVANS_OTCHET,
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
