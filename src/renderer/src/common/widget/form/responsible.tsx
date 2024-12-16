import type { Responsible } from '@/common/models'
import type { FormSpravochnikFieldsComponent } from '@/common/widget/form'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

const ResponsibleFields: FormSpravochnikFieldsComponent<Responsible> = ({
  tabIndex,
  disabled,
  name,
  error,
  spravochnik,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik
  return (
    <SpravochnikFields {...props} name={name ?? 'Материально-ответственное лицо'}>
      <div className="grid grid-cols-2 gap-5">
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          inputRef={inputRef}
          tabIndex={tabIndex}
          disabled={disabled}
          getInputValue={(selected) => selected?.fio ?? ''}
          error={!!error?.message}
          label="Ответственный"
          formElementProps={{
            grid: '1:4'
          }}
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => selected?.spravochnik_podrazdelenie_jur7_name ?? ''}
          error={!!error?.message}
          label="Подразделение"
          formElementProps={{
            grid: '1:4'
          }}
        />
      </div>
    </SpravochnikFields>
  )
}

export { ResponsibleFields }
