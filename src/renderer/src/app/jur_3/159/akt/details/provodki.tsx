import type { AktFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { NumericInput } from '@/common/components'
import {
  createOperatsiiEditor,
  createPodrazdelenieEditor,
  createStaffEditor,
  createTypeOperatsiiEditor
} from '@/common/components/editable-table/editors'
import { createNumberEditor } from '@/common/components/editable-table/editors/number'
import { inputVariants } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'
import { calcSena, calcSumma } from '@/common/lib/pricing'
import { cn } from '@/common/lib/utils'
import { TypeSchetOperatsii } from '@/common/models'

import { calcSummaNDS } from './utils'

export const provodkaColumns: EditableColumnDef<AktFormValues, 'childs'>[] = [
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
    Editor: ({ id, form, value, onChange }) => {
      return (
        <NumericInput
          editor
          value={(value as number) ?? 0}
          onValueChange={(values, event) => {
            const summa = calcSumma(value as number, form.getValues(`childs.${id}.sena`))
            if (event.source === 'event') {
              form.setValue(`childs.${id}.summa`, summa)
            }
            onChange?.(values.floatValue ?? 0)
          }}
        />
      )
    }
  },
  {
    key: 'sena',
    Editor: ({ id, form, value, onChange }) => {
      return (
        <NumericInput
          editor
          value={(value as number) ?? 0}
          onValueChange={(values, event) => {
            const summa = calcSumma(form.getValues(`childs.${id}.kol`), value as number)
            if (event.source === 'event') {
              form.setValue(`childs.${id}.summa`, summa)
            }
            onChange?.(values.floatValue ?? 0)
          }}
        />
      )
    }
  },
  {
    key: 'summa',
    Editor: ({ id, value, onChange, form }) => {
      return (
        <NumericInput
          editor
          value={(value as number) ?? 0}
          onValueChange={(values, event) => {
            const sena = calcSena(values.floatValue ?? 0, form.getValues(`childs.${id}.kol`))
            if (event.source === 'event') {
              form.setValue(`childs.${id}.sena`, sena)
            }
            onChange?.(values.floatValue ?? 0)
          }}
        />
      )
    }
  },
  {
    key: 'nds_foiz',
    Editor: createNumberEditor({
      key: 'nds_foiz',
      inputProps: {
        allowNegative: false
      }
    })
  },
  {
    key: 'nds_summa',
    Editor: ({ id, form }) => {
      const kol = form.getValues(`childs.${id}.kol`)
      const sena = form.getValues(`childs.${id}.sena`)
      const nds_foiz = form.getValues(`childs.${id}.nds_foiz`)
      return (
        <NumericInput
          className={cn(inputVariants({ editor: true, nonfocus: true }), 'text-right')}
          readOnly
          value={formatNumber(((kol || 0) * (sena || 0) * (nds_foiz || 0)) / 100)}
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
        <NumericInput
          className={cn(inputVariants({ editor: true, nonfocus: true }), 'text-right')}
          readOnly
          value={formatNumber(calcSummaNDS({ kol, sena, nds_foiz }))}
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
