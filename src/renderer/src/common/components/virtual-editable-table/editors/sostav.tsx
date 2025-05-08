import type { EditorComponent } from './interfaces'

import { createSostavSpravochnik } from '@/app/region-spravochnik/sostav'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createSostavEditor = <T extends object>(): EditorComponent<T, any> => {
  return ({ column, tabIndex, value, error, onChange }) => {
    const sostavSpravochnik = useSpravochnik(
      createSostavSpravochnik({
        value: value as number | undefined,
        onChange: (value) => {
          onChange?.(value)
        }
      })
    )
    return (
      <SpravochnikInput
        {...sostavSpravochnik}
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
