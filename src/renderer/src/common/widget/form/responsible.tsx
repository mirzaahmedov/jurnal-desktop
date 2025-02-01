import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

import type { FormSpravochnikFieldsComponent } from '@/common/widget/form'
import type { Responsible } from '@/common/models'
import { useTranslation } from 'react-i18next'

export const ResponsibleFields: FormSpravochnikFieldsComponent<Responsible> = ({
  tabIndex,
  disabled,
  name,
  error,
  spravochnik,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik
  const { t } = useTranslation(['podotchet'])
  return (
    <SpravochnikFields
      {...props}
      name={name ?? t('responsible')}
    >
      <div className="grid grid-cols-2 gap-5">
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          inputRef={inputRef}
          tabIndex={tabIndex}
          disabled={disabled}
          getInputValue={(selected) => selected?.fio ?? ''}
          error={!!error?.message}
          label={t('name', { ns: 'podotchet' })}
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
          label={t('podrazdelenie')}
          formElementProps={{
            grid: '1:4'
          }}
        />
      </div>
    </SpravochnikFields>
  )
}
