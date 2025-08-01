import type { EditorComponent } from './interfaces'

import { createPodrazdelenieSpravochnik } from '@/app/region-spravochnik/podrazdelenie'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createPodrazdelenieEditor = <
  T extends { id_spravochnik_podrazdelenie?: number }
>(): EditorComponent<T> => {
  return ({ tabIndex, value, errors, onChange }) => {
    const podrazdelnieSpravochnik = useSpravochnik(
      createPodrazdelenieSpravochnik({
        value: value as number | undefined,
        onChange
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
