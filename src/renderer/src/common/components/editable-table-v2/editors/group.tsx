import type { EditorComponent } from './interfaces'

import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createGroupEditor = <T extends { group_jur7_id?: number }>(): EditorComponent<T> => {
  return ({ tabIndex, errors, value, onChange }) => {
    const groupSpravochnik = useSpravochnik(
      createGroupSpravochnik({
        value: value as number | undefined,
        onChange
      })
    )
    return (
      <SpravochnikInput
        {...groupSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.group_jur7_id}
        name="group_jur7_id"
        getInputValue={(selected) => (selected ? (selected.group_number ?? selected.name) : '')}
      />
    )
  }
}
