import type { EditorComponent } from './interfaces'

import { createTypeOperatsiiSpravochnik } from '@/app/region-spravochnik/type-operatsii'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createTypeOperatsiiEditor = <T extends object>(): EditorComponent<T, any> => {
  return ({ column, tabIndex, value, error, onChange }) => {
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
        error={!!error}
        name={String(column.key)}
        getInputValue={(selected) => selected?.name ?? ''}
      />
    )
  }
}
