import type { Control } from 'react-hook-form'
import type { FormEditableFieldsComponent } from '@/common/widget/form'

import { FormField } from '@/common/components/ui/form'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'

type RequiredDoverennostFields = {
  doverennost: string
}

const DoverennostFields: FormEditableFieldsComponent<RequiredDoverennostFields> = ({
  tabIndex,
  form,
  disabled
}) => {
  return (
    <FormField
      name="doverennost"
      control={form.control as unknown as Control<RequiredDoverennostFields>}
      render={({ field }) => (
        <FormElement
          label="Доверенность"
          className="flex-1"
        >
          <Input
            tabIndex={tabIndex}
            disabled={disabled}
            {...field}
          />
        </FormElement>
      )}
    />
  )
}

export { DoverennostFields }
