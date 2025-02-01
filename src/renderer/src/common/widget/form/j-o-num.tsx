import type { FormSpravochnikFieldsComponent } from './types'
import type { Operatsii } from '@/common/models'

import { SpravochnikField } from '@/common/features/spravochnik'
import { useTranslation } from 'react-i18next'

const JONumFields: FormSpravochnikFieldsComponent<Operatsii> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik
}) => {
  const { t } = useTranslation()
  return (
    <SpravochnikField
      readOnly
      label={t('jo_num')}
      tabIndex={tabIndex}
      disabled={disabled}
      error={!!error?.message}
      name={name ?? 'jo_num'}
      getInputValue={(selected) => selected?.schet ?? ''}
      {...spravochnik}
    />
  )
}

export { JONumFields }
