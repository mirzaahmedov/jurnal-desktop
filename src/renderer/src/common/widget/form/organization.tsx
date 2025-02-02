import type { FormSpravochnikFieldsComponent } from './types'
import type { Organization } from '@/common/models'

import { useTranslation } from 'react-i18next'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

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

  const { t } = useTranslation()

  return (
    <SpravochnikFields
      {...props}
      name={name ?? t('organization')}
    >
      <SpravochnikField
        {...spravochnikProps}
        readOnly
        inputRef={inputRef}
        tabIndex={tabIndex}
        disabled={disabled}
        error={!!error?.message}
        getInputValue={(selected) => selected?.name ?? ''}
        label={t('organization')}
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
        label={t('bank')}
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
        label={t('mfo')}
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
        label={t('inn')}
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
        label={t('raschet-schet')}
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
          label={t('raschet-schet-gazna')}
          formElementProps={{
            grid: '2:6'
          }}
        />
      ) : null}
    </SpravochnikFields>
  )
}

export { OrganizationFields }
