import type { EditorComponent } from './interfaces'

import { createSostavSpravochnik } from '@/app/region-spravochnik/sostav'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createStaffEditor = <
  T extends { id_spravochnik_sostav?: number }
>(): EditorComponent<T> => {
  return ({ tabIndex, value, errors, onChange }) => {
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
        error={!!errors?.id_spravochnik_sostav}
        name="id_spravochnik_sostav"
        getInputValue={(selected) => selected?.name ?? ''}
      />
    )
  }
}
