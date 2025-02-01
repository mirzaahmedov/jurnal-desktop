import {
  createOperatsiiEditor,
  createPodotchetEditor,
  createPodrazdelenieEditor,
  createStaffEditor,
  createSummaEditor,
  createTypeOperatsiiEditor
} from '@renderer/common/components/editable-table/editors'

import type { EditableColumnType } from '@renderer/common/components/editable-table'
import type { RasxodPodvodkaPayloadType } from '../service'
import { TypeSchetOperatsii } from '@/common/models'

export const podvodkaColumns: EditableColumnType<RasxodPodvodkaPayloadType>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'provodka',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.BANK_RASXOD
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
    key: 'id_spravochnik_podotchet_litso',
    header: 'podotchet-litso',
    Editor: createPodotchetEditor()
  },
  {
    key: 'id_spravochnik_podrazdelenie',
    header: 'podrazdelenie',
    Editor: createPodrazdelenieEditor()
  }
]
