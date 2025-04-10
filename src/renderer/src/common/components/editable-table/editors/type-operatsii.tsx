import type { EditorComponent } from './types'

import { createTypeOperatsiiSpravochnik } from '@/app/region-spravochnik/type-operatsii'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createTypeOperatsiiEditor = <
  T extends { id_spravochnik_type_operatsii?: number }
>(): EditorComponent<T> => {
  return ({ tabIndex, id, row, errors, onChange }) => {
    const typeOperatsiiSpravochnik = useSpravochnik(
      createTypeOperatsiiSpravochnik({
        value: row.id_spravochnik_type_operatsii || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'id_spravochnik_type_operatsii',
            payload: {
              ...row,
              id_spravochnik_type_operatsii: value
            }
          })
        }
      })
    )
    return (
      <SpravochnikInput
        {...typeOperatsiiSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.id_spravochnik_type_operatsii}
        name="id_spravochnik_type_operatsii"
        getInputValue={(selected) => selected?.name ?? ''}
      />
    )
  }
}
