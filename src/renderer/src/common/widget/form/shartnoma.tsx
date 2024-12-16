import type { FormSpravochnikFieldsComponent } from './types'
import type { Shartnoma } from '@/common/models'

import { formatLocaleDate } from '@/common/lib/format'
import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

const ShartnomaFields: FormSpravochnikFieldsComponent<Shartnoma> = ({
  tabIndex,
  disabled,
  spravochnik,
  name,
  error,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik
  return (
    <SpravochnikFields {...props} name={name ?? 'Договор'}>
      <div className="grid grid-cols-2 gap-5">
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          inputRef={inputRef}
          tabIndex={tabIndex}
          disabled={disabled}
          getInputValue={(selected) => selected?.doc_num ?? ''}
          error={!!error?.message}
          label="№ договора"
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => formatLocaleDate(selected?.doc_date)}
          error={!!error?.message}
          label="Дата договора"
        />
      </div>
    </SpravochnikFields>
  )
}

export { ShartnomaFields }
