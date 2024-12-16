import type { EditableColumnType } from '@/common/features/editable-table'
import type { PokazatUslugiProvodkaForm } from '../service'

import { TypeSchetOperatsii } from '@/common/models'
import {
  createOperatsiiEditor,
  createTypeOperatsiiEditor,
  createStaffEditor,
  createPodrazdelenieEditor,
  createNumberEditor
} from '@/common/features/editable-table/editors'

export const podvodkaColumns: EditableColumnType<PokazatUslugiProvodkaForm>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'Подводка',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.POKAZAT_USLUGI
    })
  },
  {
    key: 'kol',
    header: 'Количество',
    Editor: createNumberEditor({ key: 'kol' })
  },
  {
    key: 'sena',
    header: 'Цена',
    Editor: createNumberEditor({ key: 'sena' })
  },
  {
    key: 'nds_foiz',
    header: 'НДС %',
    Editor: createNumberEditor({ key: 'nds_foiz' })
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
