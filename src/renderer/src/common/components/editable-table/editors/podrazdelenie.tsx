import type { EditorComponentType } from './types'

import { createPodrazdelenieSpravochnik } from '@/app/region-spravochnik/podrazdelenie'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createPodrazdelenieEditor = <
  T extends { id_spravochnik_podrazdelenie?: number }
>(): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange }) => {
    const podrazdelnieSpravochnik = useSpravochnik(
      createPodrazdelenieSpravochnik({
        value: row.id_spravochnik_podrazdelenie || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'id_spravochnik_podrazdelenie',
            payload: {
              ...row,
              id_spravochnik_podrazdelenie: value
            }
          })
        }
      })
    )
    return (
      <SpravochnikInput
        {...podrazdelnieSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.id_spravochnik_podrazdelenie}
        name="id_spravochnik_podrazdelenie"
        getInputValue={(selected) => selected?.name ?? ''}
      />
    )
  }
}
