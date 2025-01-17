import type { EditorComponentType } from './types'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { useSpravochnik, SpravochnikInput } from '@/common/features/spravochnik'

export const createPodotchetEditor = <
  T extends { id_spravochnik_podotchet_litso?: number }
>(): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange }) => {
    const podotchetSpravochnik = useSpravochnik(
      createPodotchetSpravochnik({
        value: row.id_spravochnik_podotchet_litso || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'id_spravochnik_podotchet_litso',
            payload: {
              ...row,
              id_spravochnik_podotchet_litso: value
            }
          })
        }
      })
    )
    return (
      <SpravochnikInput
        {...podotchetSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.id_spravochnik_podotchet_litso}
        name="id_spravochnik_podotchet_litso"
        getInputValue={(selected) => selected?.name ?? ''}
      />
    )
  }
}
