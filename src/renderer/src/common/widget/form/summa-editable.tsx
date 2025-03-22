import type { FormEditableFieldsComponent } from './types'
import type { Control } from 'react-hook-form'

import { useTranslation } from 'react-i18next'

import { Fieldset, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'
import { cn, numberToWords } from '@/common/lib/utils'

type RequiredSummaEditableFields = {
  summa?: number
}
export const SummaEditableFields: FormEditableFieldsComponent<RequiredSummaEditableFields> = ({
  tabIndex,
  name,
  form,
  disabled,
  dialog = false,
  containerProps,
  ...props
}) => {
  const { t, i18n } = useTranslation()
  return (
    <Fieldset
      {...props}
      className={cn(dialog && 'p-0', props.className)}
      name={name ?? t('summa')}
    >
      <div
        {...containerProps}
        className={cn(
          'flex items-start gap-5',
          dialog && 'flex-col items-stretch',
          containerProps?.className
        )}
      >
        <FormField
          control={form.control as unknown as Control<RequiredSummaEditableFields>}
          name="summa"
          render={({ field }) => (
            <FormElement label={t('summa')}>
              <NumericInput
                {...field}
                allowNegative={false}
                tabIndex={tabIndex}
                disabled={disabled}
                value={field.value || ''}
                onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                className="text-lg font-bold text-slate-600"
              />
            </FormElement>
          )}
        />

        <Textarea
          readOnly
          tabIndex={-1}
          className="flex-1"
          value={numberToWords(form.watch().summa ?? 0, i18n.language)}
        />
      </div>
    </Fieldset>
  )
}
