import type { EditorComponent } from './interfaces'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createPodotchetEditor = <
  T extends { id_spravochnik_podotchet_litso?: number }
>(): EditorComponent<T, any> => {
  return ({ tabIndex, errors, value, onChange }) => {
    const podotchetSpravochnik = useSpravochnik(
      createPodotchetSpravochnik({
        value: value as number | undefined,
        onChange
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
