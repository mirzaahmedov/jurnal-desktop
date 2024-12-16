import type { EditableColumnType } from '@/common/features/editable-table'
import type { RasxodPodvodkaPayloadType } from '../service'

import { TypeSchetOperatsii } from '@/common/models'
import {
  createPodotchetEditor,
  createOperatsiiEditor,
  createTypeOperatsiiEditor,
  createStaffEditor,
  createPodrazdelenieEditor,
  createSummaEditor
} from '@/common/features/editable-table/editors'

export const podvodkaColumns: EditableColumnType<RasxodPodvodkaPayloadType>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'Подводка',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.BANK_RASXOD
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
    key: 'id_spravochnik_podotchet_litso',
    header: 'Подотчетное лицо',
    Editor: createPodotchetEditor()
  },
  {
    key: 'id_spravochnik_podrazdelenie',
    header: 'Подразделение',
    Editor: createPodrazdelenieEditor()
  }
]
