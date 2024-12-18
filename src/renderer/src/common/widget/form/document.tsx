import type { Control } from 'react-hook-form'
import type { FormEditableFieldsComponent } from './types'

import { DatePicker, Fieldset } from '@/common/components'
import { FormField } from '@/common/components/ui/form'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'

type RequiredDocumentFields = {
  doc_num: string
  doc_date: string
}

const DocumentFields: FormEditableFieldsComponent<RequiredDocumentFields> = ({
  tabIndex,
  name,
  form,
  disabled,
  ...props
}) => {
  return (
    <Fieldset
      {...props}
      name={name ?? 'Документ'}
    >
      <div className="flex items-center gap-5 flex-wrap">
        <FormField
          name="doc_num"
          control={form.control as unknown as Control<RequiredDocumentFields>}
          render={({ field }) => (
            <FormElement
              label="Документ №"
              className="flex-1 max-w-xs"
            >
              <Input
                autoFocus
                tabIndex={tabIndex}
                disabled={disabled}
                {...field}
              />
            </FormElement>
          )}
        />

        <FormField
          name="doc_date"
          control={form.control as unknown as Control<RequiredDocumentFields>}
          render={({ field }) => (
            <FormElement label="Дата проводки">
              <DatePicker
                tabIndex={tabIndex}
                disabled={disabled}
                {...field}
              />
            </FormElement>
          )}
        />
      </div>
    </Fieldset>
  )
}

export { DocumentFields }
