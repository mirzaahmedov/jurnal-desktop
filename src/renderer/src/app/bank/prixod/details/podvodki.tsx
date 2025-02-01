import {
  createOperatsiiEditor,
  createPodotchetEditor,
  createPodrazdelenieEditor,
  createStaffEditor,
  createSummaEditor,
  createTypeOperatsiiEditor
} from '@renderer/common/components/editable-table/editors'

import type { EditableColumnType } from '@renderer/common/components/editable-table'
import type { PrixodPodvodkaPayloadType } from '../service'
import { TypeSchetOperatsii } from '@/common/models'

export const podvodkaColumns: EditableColumnType<PrixodPodvodkaPayloadType>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'provodka',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.BANK_PRIXOD
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
  },
  {
    key: 'id_spravochnik_podotchet_litso',
    header: 'podotchet-litso',
    Editor: createPodotchetEditor()
  }
]
