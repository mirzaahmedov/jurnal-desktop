import type { EditorComponent } from './interfaces'

import { createPodrazdelenieSpravochnik } from '@/app/region-spravochnik/podrazdelenie'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createPodrazdelenieEditor = <T extends object>(): EditorComponent<T, any> => {
  return ({ column, tabIndex, value, error, onChange }) => {
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
        error={!!error}
        name={String(column.key)}
        getInputValue={(selected) => selected?.name ?? ''}
      />
    )
  }
}
