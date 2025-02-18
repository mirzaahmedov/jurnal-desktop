import type { FormSpravochnikFieldsComponent } from './types'
import type { Operatsii } from '@/common/models'

import { useTranslation } from 'react-i18next'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

export const OperatsiiFields: FormSpravochnikFieldsComponent<Operatsii> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik
  const { t } = useTranslation()

  return (
    <SpravochnikFields
      {...props}
      name={name ?? t('operatsii')}
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
          label={t('operatsii')}
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => selected?.sub_schet ?? ''}
          error={!!error?.message}
          label={`${t('schet')} / ${t('subschet')}`}
        />
      </div>
    </SpravochnikFields>
  )
}
