import type { EditorComponent } from './interfaces'

import { createMainZarplataSpravochnik } from '@/common/features/main-zarplata/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createMainZarplataEditor = <T extends { mainZarplataId?: number }>(): EditorComponent<
  T,
  any
> => {
  return ({ tabIndex, errors, value, onChange }) => {
    const zarplataSpravochnik = useSpravochnik(
      createMainZarplataSpravochnik({
        value: value as number | undefined,
        onChange
      })
    )

    return (
      <SpravochnikInput
        {...zarplataSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.mainZarplataId}
        name="mainZarplataId"
        getInputValue={(selected) => selected?.fio ?? ''}
      />
    )
  }
}
