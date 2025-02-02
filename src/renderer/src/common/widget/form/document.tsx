import type { FormEditableFieldsComponent } from './types'
import type { Control } from 'react-hook-form'

import { CalendarProps } from '@renderer/common/components/ui/calendar'
import { validateDate } from '@renderer/common/lib/date'
import { cn } from '@renderer/common/lib/utils'
import { useTranslation } from 'react-i18next'

import { DatePicker, Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

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
> = ({
  tabIndex,
  name,
  form,
  disabled,
  dialog = false,
  validateDocDate,
  calendarProps,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <Fieldset
      {...props}
      className={cn(dialog && 'p-0 pb-5', props.className)}
      name={name ?? t('document')}
    >
      <div className="flex items-center gap-5 flex-wrap">
        <FormField
          name="doc_num"
          control={form.control as unknown as Control<RequiredDocumentFields>}
          render={({ field }) => (
            <FormElement
              label={t('doc_num')}
              className="flex-1 max-w-xs"
              direction={dialog ? 'column' : 'row'}
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
            <FormElement
              label={t('doc_date')}
              direction={dialog ? 'column' : 'row'}
            >
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
