import type { FormSpravochnikFieldsComponent } from './types'
import type { Podotchet } from '@/common/models'

import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'
import { useTranslation } from 'react-i18next'

const PodotchetFields: FormSpravochnikFieldsComponent<Podotchet> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik

  const { t } = useTranslation(['podotchet'])

  return (
    <SpravochnikFields
      {...props}
      name={name ?? t('podotchet-litso')}
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
          label={t('name', { ns: 'podotchet' })}
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => selected?.rayon ?? ''}
          error={!!error?.message}
          label={t('rayon', { ns: 'podotchet' })}
        />
      </div>
    </SpravochnikFields>
  )
}

export { PodotchetFields }
