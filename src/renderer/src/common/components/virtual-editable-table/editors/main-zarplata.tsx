import type { EditorComponent } from './interfaces'

import { createMainZarplataSpravochnik } from '@/common/features/main-zarplata/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createMainZarplataEditor = <T extends { mainZarplataId?: number }>(options?: {
  withDoljnostName?: boolean
}): EditorComponent<T, any> => {
  const { withDoljnostName = false } = options || {}
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
        getInputValue={(selected) =>
          selected
            ? [selected?.fio ?? '', withDoljnostName ? selected?.doljnostName : ''].join(' - ')
            : ''
        }
      />
    )
  }
}
