import type { FormSpravochnikFieldsComponent } from './types'
import type { Podotchet } from '@/common/models'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

const PodotchetFields: FormSpravochnikFieldsComponent<Podotchet> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik
  return (
    <SpravochnikFields
      {...props}
      name={name ?? 'Подотчетное лицо'}
    >
      <div className="grid grid-cols-2 gap-5">
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          inputRef={inputRef}
          tabIndex={tabIndex}
          disabled={disabled}
          getInputValue={(selected) => selected?.name ?? ''}
          error={!!error?.message}
          label="Имя"
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => selected?.rayon ?? ''}
          error={!!error?.message}
          label="Район"
        />
      </div>
    </SpravochnikFields>
  )
}

export { PodotchetFields }
