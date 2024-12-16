import type { Organization } from '@/common/models'
import type { FormSpravochnikFieldsComponent } from './types'

import { SpravochnikFields, SpravochnikField } from '@/common/features/spravochnik'

const OrganizationFields: FormSpravochnikFieldsComponent<Organization, { gazna?: boolean }> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik,
  gazna = false,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik
  return (
    <SpravochnikFields {...props} name={name ?? 'Организация'}>
      <SpravochnikField
        {...spravochnikProps}
        readOnly
        inputRef={inputRef}
        tabIndex={tabIndex}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.name ?? ''}
        label="Плательщик"
        formElementProps={{
          grid: '2:6'
        }}
      />

      <SpravochnikField
        {...spravochnikProps}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.bank_klient ?? ''}
        label="Банк"
        formElementProps={{
          grid: '2:6'
        }}
      />

      <SpravochnikField
        {...spravochnikProps}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.mfo ?? ''}
        label="МФО"
        formElementProps={{
          grid: '2:6'
        }}
      />

      <SpravochnikField
        {...spravochnikProps}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.inn ?? ''}
        label="ИНН"
        formElementProps={{
          grid: '2:6'
        }}
      />

      <SpravochnikField
        {...spravochnikProps}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.raschet_schet ?? ''}
        label="Расчетный счет"
        formElementProps={{
          grid: '2:6'
        }}
      />

      {gazna ? (
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          error={!!error?.message}
          getInputValue={(selected) => selected?.raschet_schet_gazna ?? ''}
          label="Расчетный счет (газна)"
          formElementProps={{
            grid: '2:6'
          }}
        />
      ) : null}
    </SpravochnikFields>
  )
}

export { OrganizationFields }
