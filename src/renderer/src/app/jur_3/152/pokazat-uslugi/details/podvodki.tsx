import type { PokazatUslugiFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import {
  createNumberEditor,
  createOperatsiiEditor,
  createPodrazdelenieEditor,
  createStaffEditor,
  createTypeOperatsiiEditor
} from '@/common/components/editable-table/editors'
import { Input } from '@/common/components/ui/input'
import { inputVariants } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'
import { TypeSchetOperatsii } from '@/common/models'

export const podvodkaColumns: EditableColumnDef<PokazatUslugiFormValues, 'childs'>[] = [
  {
    key: 'spravochnik_operatsii_id',
    header: 'provodka',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.POKAZAT_USLUGI,
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
    Editor: ({ id, form }) => {
      const kol = form.getValues(`childs.${id}.kol`)
      const sena = form.getValues(`childs.${id}.sena`)
      return (
        <Input
          className={cn(inputVariants({ editor: true, nonfocus: true }), 'text-right')}
          readOnly
          value={formatNumber((kol || 0) * (sena || 0) || 0, 0)}
        />
      )
    }
  },
  {
    key: 'nds_foiz',
    Editor: createNumberEditor({ key: 'nds_foiz', max: 99, inputProps: { allowNegative: false } })
  },
  {
    key: 'nds_summa',
    Editor: ({ id, form }) => {
      const kol = form.getValues(`childs.${id}.kol`)
      const sena = form.getValues(`childs.${id}.sena`)
      const nds_foiz = form.getValues(`childs.${id}.nds_foiz`)
      return (
        <Input
          className={cn(inputVariants({ editor: true, nonfocus: true }), 'text-right')}
          readOnly
          value={((kol || 0) * (sena || 0) * (nds_foiz || 0)) / 100 || ''}
        />
      )
    }
  },
  {
    key: 'summa_s_nds',
    Editor: ({ id, form }) => {
      const kol = form.getValues(`childs.${id}.kol`)
      const sena = form.getValues(`childs.${id}.sena`)
      const nds_foiz = form.getValues(`childs.${id}.nds_foiz`)
      return (
        <Input
          className={cn(inputVariants({ editor: true, nonfocus: true }), 'text-right')}
          readOnly
          value={formatNumber(
            (kol || 0) * (sena || 0) + ((kol || 0) * (sena || 0) * (nds_foiz || 0)) / 100 || 0,
            0
          )}
        />
      )
    }
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
