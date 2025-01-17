import type { EditorComponentType } from './types'

import { createSostavSpravochnik } from '@/app/region-spravochnik/sostav'
import { useSpravochnik, SpravochnikInput } from '@/common/features/spravochnik'

export const createStaffEditor = <
  T extends { id_spravochnik_sostav?: number }
>(): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange }) => {
    const sostavSpravochnik = useSpravochnik(
      createSostavSpravochnik({
        value: row.id_spravochnik_sostav || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'id_spravochnik_sostav',
            payload: {
              ...row,
              id_spravochnik_sostav: value
            }
          })
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
