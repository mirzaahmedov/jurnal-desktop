import type { Operatsii } from '@/common/models'

import { SpravochnikFields, SpravochnikField } from '@/common/features/spravochnik'
import { FormSpravochnikFieldsComponent } from './types'

const OperatsiiFields: FormSpravochnikFieldsComponent<Operatsii> = ({
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
      name={name ?? 'Операция'}
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
          label="Операция"
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => selected?.sub_schet ?? ''}
          error={!!error?.message}
          label="Счет/Субсчет"
        />
      </div>
    </SpravochnikFields>
  )
}

export { OperatsiiFields }
