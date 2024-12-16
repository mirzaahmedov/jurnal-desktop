import type { TypeSchetOperatsii } from '@/common/models'
import type { EditorComponentType } from './types'

import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { useSpravochnik, SpravochnikInput } from '@/common/features/spravochnik'

type OperatsiiEditorOptions = {
  type_schet: TypeSchetOperatsii
}
export const createOperatsiiEditor = <T extends { spravochnik_operatsii_id?: number }>({
  type_schet
}: OperatsiiEditorOptions): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange }) => {
    const operatsiiSpravochnik = useSpravochnik(
      createOperatsiiSpravochnik({
        value: row.spravochnik_operatsii_id || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'spravochnik_operatsii_id',
            payload: {
              ...row,
              spravochnik_operatsii_id: value
            }
          })
        },
        params: {
          type_schet
        }
      })
    )
    return (
      <SpravochnikInput
        {...operatsiiSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.spravochnik_operatsii_id}
        name="spravochnik_operatsii_id"
        getInputValue={(selected) =>
          selected ? `${selected.schet} / ${selected.sub_schet} - ${selected.name}` : '-'
        }
      />
    )
  }
}
