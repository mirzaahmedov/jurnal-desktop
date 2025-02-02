import type { FormSpravochnikFieldsComponent } from './types'
import type { Shartnoma } from '@/common/models'

import { useTranslation } from 'react-i18next'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'
import { formatLocaleDate } from '@/common/lib/format'

const ShartnomaFields: FormSpravochnikFieldsComponent<Shartnoma> = ({
  tabIndex,
  disabled,
  spravochnik,
  name,
  error,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik

  const { t } = useTranslation()

  return (
    <SpravochnikFields
      {...props}
      name={name ?? t('shartnoma')}
    >
      <div className="grid grid-cols-2 gap-5">
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          inputRef={inputRef}
          tabIndex={tabIndex}
          disabled={disabled}
          getInputValue={(selected) => selected?.doc_num ?? ''}
          error={!!error?.message}
          label={t('shartnoma-number')}
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => formatLocaleDate(selected?.doc_date)}
          error={!!error?.message}
          label={t('shartnoma-date')}
        />
      </div>
    </SpravochnikFields>
  )
}

export { ShartnomaFields }
