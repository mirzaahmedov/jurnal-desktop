import type { EditorComponent } from './interfaces'

import { createTypeOperatsiiSpravochnik } from '@/app/region-spravochnik/type-operatsii'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createTypeOperatsiiEditor = <
  T extends { id_spravochnik_type_operatsii?: number }
>(): EditorComponent<T> => {
  return ({ tabIndex, value, errors, onChange }) => {
    const typeOperatsiiSpravochnik = useSpravochnik(
      createTypeOperatsiiSpravochnik({
        value: value as number | undefined,
        onChange
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
