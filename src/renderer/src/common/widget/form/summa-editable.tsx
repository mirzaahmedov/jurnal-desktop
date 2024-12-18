import type { FormEditableFieldsComponent } from './types'

import { Fieldset, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'
import { numberToWords } from '@/common/lib/utils'
import { Control } from 'react-hook-form'

type RequiredSummaEditableFields = {
  summa?: number
}
const SummaEditableFields: FormEditableFieldsComponent<RequiredSummaEditableFields> = ({
  tabIndex,
  name,
  form,
  disabled,
  ...props
}) => {
  return (
    <Fieldset
      {...props}
      name={name ?? 'Сумма'}
    >
      <div className="flex items-start gap-5">
        <FormField
          control={form.control as unknown as Control<RequiredSummaEditableFields>}
          name="summa"
          render={({ field }) => (
            <FormElement label="Сумма">
              <NumericInput
                {...field}
                tabIndex={tabIndex}
                disabled={disabled}
                value={field.value || ''}
                onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
              />
            </FormElement>
          )}
        />

        <Textarea
          readOnly
          tabIndex={-1}
          className="flex-1"
          value={numberToWords(form.watch().summa ?? 0)}
        />
      </div>
    </Fieldset>
  )
}

export { SummaEditableFields }
