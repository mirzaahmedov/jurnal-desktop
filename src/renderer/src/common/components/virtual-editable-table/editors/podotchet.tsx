import type { EditorComponent } from './interfaces'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createPodotchetEditor = <T extends object>(): EditorComponent<T, any> => {
  return ({ column, tabIndex, error, value, onChange }) => {
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
        error={!!error}
        name={String(column.key)}
        getInputValue={(selected) => selected?.name ?? ''}
      />
    )
  }
}
