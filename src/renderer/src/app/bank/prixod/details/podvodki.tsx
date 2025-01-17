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
    header: 'Подводка',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.BANK_PRIXOD
    })
  },
  {
    key: 'summa',
    header: 'Сумма',
    Editor: createSummaEditor()
  },
  {
    key: 'id_spravochnik_type_operatsii',
    header: 'Тип операции',
    Editor: createTypeOperatsiiEditor()
  },
  {
    key: 'id_spravochnik_sostav',
    header: 'Состав',
    Editor: createStaffEditor()
  },
  {
    key: 'id_spravochnik_podrazdelenie',
    header: 'Подразделение',
    Editor: createPodrazdelenieEditor()
  },
  {
    key: 'id_spravochnik_podotchet_litso',
    header: 'Подотчетное лицо',
    Editor: createPodotchetEditor()
  }
]
