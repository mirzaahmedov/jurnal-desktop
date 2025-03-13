import type { AktProvodkaForm } from '../service'
import type { EditableColumnType } from '@renderer/common/components/editable-table'

import {
  createOperatsiiEditor,
  createPodrazdelenieEditor,
  createStaffEditor,
  createTypeOperatsiiEditor
} from '@renderer/common/components/editable-table/editors'
import { createNumberEditor } from '@renderer/common/components/editable-table/editors/number'
import { Input } from '@renderer/common/components/ui/input'
import { inputVariants } from '@renderer/common/features/spravochnik'
import { cn } from '@renderer/common/lib/utils'

import { TypeSchetOperatsii } from '@/common/models'

export const podvodkaColumns: EditableColumnType<AktProvodkaForm>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'provodka',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.AKT,
      field: 'spravochnik_operatsii_id'
    })
  },
  {
    key: 'kol',
    Editor: createNumberEditor({ key: 'kol', inputProps: { allowNegative: false } })
  },
  {
    key: 'sena',
    Editor: createNumberEditor({ key: 'sena', inputProps: { allowNegative: false } })
  },
  {
    key: 'summa',
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
    Editor: createNumberEditor({ key: 'nds_foiz', max: 99, inputProps: { allowNegative: false } })
  },
  {
    key: 'nds_summa',
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
