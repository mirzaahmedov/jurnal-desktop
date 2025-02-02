import type { FormSpravochnikFieldsComponent } from './types'
import type { Operatsii } from '@/common/models'

import { Fieldset } from '@/common/components'
import { SpravochnikInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { createSpravochnikKeyBindings } from '@/common/features/spravochnik'

const OperationFields: FormSpravochnikFieldsComponent<Operatsii> = ({
  tabIndex,
  triggerRef,
  name,
  selected,
  open,
  clear,
  errorMessage,
  disabled,
  ...props
}) => {
  return (
    <Fieldset
      {...props}
      name={name ?? 'Операция'}
    >
      <div className="flex items-center gap-5 flex-wrap">
        <FormElement
          label="Названия"
          className="w-full flex-1"
          message={errorMessage}
        >
          <SpravochnikInput
            readOnly
            tabIndex={tabIndex}
            disabled={disabled}
            ref={triggerRef}
            value={selected?.name || ''}
            onKeyDown={createSpravochnikKeyBindings({ open, clear })}
            onClear={clear}
            onDoubleClick={open}
          />
        </FormElement>

        <FormElement
          label="Счет/Субсчет"
          className="flex-1 w-full"
          message={errorMessage}
        >
          <SpravochnikInput
            readOnly
            tabIndex={-1}
            disabled={disabled}
            value={`${selected?.schet ?? '-'} / ${selected?.sub_schet ?? '-'}`}
            onKeyDown={createSpravochnikKeyBindings({ open, clear })}
            onClear={clear}
            onDoubleClick={open}
          />
        </FormElement>
      </div>
    </Fieldset>
  )
}

export { OperationFields }
