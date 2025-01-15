import { SpravochnikField, SpravochnikFields } from '@/common/features/spravochnik'

import type { FormSpravochnikFieldsComponent } from './types'
import type { Smeta } from '@/common/models'
import { cn } from '@renderer/common/lib/utils'

const SmetaFields: FormSpravochnikFieldsComponent<Smeta> = ({
  tabIndex,
  disabled,
  error,
  name,
  spravochnik,
  containerProps,
  dialog = false,
  ...props
}) => {
  const { inputRef, ...spravochnikProps } = spravochnik
  return (
    <SpravochnikFields
      {...props}
      className={cn(dialog && 'p-0 mt-5', props.className)}
      name={name ?? 'Смета'}
    >
      <div
        {...containerProps}
        className={cn('grid grid-cols-2 gap-5', dialog && 'grid-cols-1', containerProps?.className)}
      >
        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={tabIndex}
          disabled={disabled}
          inputRef={inputRef}
          getInputValue={(selected) => selected?.smeta_name ?? ''}
          label="Название"
          formElementProps={{
            direction: dialog ? 'column' : 'row'
          }}
          error={!!error?.message}
        />

        <SpravochnikField
          {...spravochnikProps}
          readOnly
          tabIndex={-1}
          disabled={disabled}
          getInputValue={(selected) => selected?.smeta_number ?? ''}
          label="Номер"
          formElementProps={{
            direction: dialog ? 'column' : 'row'
          }}
          error={!!error?.message}
        />
      </div>
    </SpravochnikFields>
  )
}

export { SmetaFields }
