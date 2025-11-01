import type { EditorComponent } from './interfaces'

import { createResponsibleSpravochnik } from '@/app/jur_7/responsible/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createResponsibleEditor = <
  T extends { responsible_id?: number }
>(): EditorComponent<T> => {
  return ({ tabIndex, errors, value, onChange }) => {
    const responsibleSpravochnik = useSpravochnik(
      createResponsibleSpravochnik({
        value: value as number | undefined,
        onChange
      })
    )
    return (
      <SpravochnikInput
        {...responsibleSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.responsible_id}
        name="responsible_id"
        getInputValue={(selected) => selected?.fio ?? ''}
      />
    )
  }
}
