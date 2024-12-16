import type { FormSpravochnikFieldsComponent } from './types'
import type { Smeta } from '@/common/models'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

const SmetaFields: FormSpravochnikFieldsComponent<Smeta> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik
  return (
    <SpravochnikFields {...props} name={name ?? 'Смета'}>
      <div className="grid grid-cols-2 gap-5">
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={tabIndex}
          disabled={disabled}
          inputRef={inputRef}
          getInputValue={(selected) => selected?.smeta_name ?? ''}
          label="Название"
          error={!!error?.message}
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => selected?.smeta_number ?? ''}
          label="Номер"
          error={!!error?.message}
        />
      </div>
    </SpravochnikFields>
  )
}

export { SmetaFields }
