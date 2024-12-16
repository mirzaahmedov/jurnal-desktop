import type { FormSpravochnikFieldsComponent } from './types'
import type { Operatsii } from '@/common/models'

import { SpravochnikField } from '@/common/features/spravochnik'

const JONumFields: FormSpravochnikFieldsComponent<Operatsii> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik
}) => {
  return (
    <SpravochnikField
      readOnly
      label="Ж \ О"
      tabIndex={tabIndex}
      disabled={disabled}
      error={!!error?.message}
      name={name ?? 'jo_num'}
      getInputValue={(selected) => selected?.schet ?? ''}
      {...spravochnik}
    />
  )
}

export { JONumFields }
