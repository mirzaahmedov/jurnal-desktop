import type { Control } from 'react-hook-form'
import type { FormEditableFieldsComponent } from './types'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'

type RequiredOpisanieFields = {
  opisanie?: string
}

const OpisanieFields: FormEditableFieldsComponent<RequiredOpisanieFields> = ({
  tabIndex,
  form
}) => {
  return (
    <FormField
      name="opisanie"
      control={form.control as unknown as Control<RequiredOpisanieFields>}
      render={({ field }) => (
        <FormElement
          direction="column"
          label="Описания"
        >
          <Textarea
            tabIndex={tabIndex}
            rows={4}
            spellCheck={false}
            {...field}
          />
        </FormElement>
      )}
    />
  )
}

export { OpisanieFields }
