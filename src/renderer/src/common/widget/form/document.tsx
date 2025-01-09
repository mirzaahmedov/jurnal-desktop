import { DatePicker, Fieldset } from '@/common/components'

import { CalendarProps } from '@renderer/common/components/ui/calendar'
import type { Control } from 'react-hook-form'
import type { FormEditableFieldsComponent } from './types'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { validateDate } from '@renderer/common/lib/date'

type RequiredDocumentFields = {
  doc_num: string
  doc_date: string
}

const DocumentFields: FormEditableFieldsComponent<
  RequiredDocumentFields,
  {
    validateDocDate?: (value: string) => boolean
    calendarProps?: CalendarProps
  }
> = ({ tabIndex, name, form, disabled, validateDocDate, calendarProps, ...props }) => {
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
                validate={validateDocDate ?? validateDate}
                calendarProps={calendarProps}
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
