import {
  createOperatsiiEditor,
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
    header: 'Подводка',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.KASSA_RASXOD
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
  }
]
