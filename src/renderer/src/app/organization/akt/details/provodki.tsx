import {
  createOperatsiiEditor,
  createPodrazdelenieEditor,
  createStaffEditor,
  createTypeOperatsiiEditor
} from '@renderer/common/components/editable-table/editors'

import type { AktProvodkaForm } from '../service'
import type { EditableColumnType } from '@renderer/common/components/editable-table'
import { Input } from '@renderer/common/components/ui/input'
import { TypeSchetOperatsii } from '@/common/models'
import { cn } from '@renderer/common/lib/utils'
import { createNumberEditor } from '@renderer/common/components/editable-table/editors/number'
import { inputVariants } from '@renderer/common/components'

export const podvodkaColumns: EditableColumnType<AktProvodkaForm>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'Подводка',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.AKT
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
    key: 'summa',
    header: 'Сумма',
    Editor: ({ row }) => (
      <Input
        className={cn(inputVariants({ editor: true, nonfocus: true }), 'text-right')}
        readOnly
        value={(row.kol || 0) * (row.sena || 0)}
      />
    )
  },
  {
    key: 'nds_foiz',
    header: 'НДС %',
    Editor: createNumberEditor({ key: 'nds_foiz', max: 99 })
  },
  {
    key: 'nds_summa',
    header: 'НДС сумма',
    Editor: ({ row }) => (
      <Input
        className={cn(inputVariants({ editor: true, nonfocus: true }), 'text-right')}
        readOnly
        value={((row.kol || 0) * (row.sena || 0) * (row.nds_foiz || 0)) / 100}
      />
    )
  },
  {
    key: 'summa_s_nds',
    header: 'Сумма с НДС',
    Editor: ({ row }) => (
      <Input
        className={cn(inputVariants({ editor: true, nonfocus: true }), 'text-right')}
        readOnly
        value={
          (row.kol || 0) * (row.sena || 0) +
          ((row.kol || 0) * (row.sena || 0) * (row.nds_foiz || 0)) / 100
        }
      />
    )
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
