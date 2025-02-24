import type { ShartnomaFormValues } from '../service'
import type { FormEditableFieldsComponent } from '@renderer/common/widget/form'
import type { Control } from 'react-hook-form'

import { Fieldset } from '@renderer/common/components'
import { FormControl, FormField, FormItem, FormLabel } from '@renderer/common/components/ui/form'
import { Switch } from '@renderer/common/components/ui/switch'
import { cn } from '@renderer/common/lib/utils'
import { useTranslation } from 'react-i18next'

const PudratchiFields: FormEditableFieldsComponent<ShartnomaFormValues> = ({
  form,
  name,
  tabIndex,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <Fieldset
      {...props}
      name={name ?? ''}
    >
      <div className="flex items-start gap-5">
        <FormField
          name="pudratchi_bool"
          control={form.control as unknown as Control<ShartnomaFormValues>}
          render={({ field }) => (
            <FormItem className="flex items-center gap-5">
              <FormLabel className={cn('transition-colors', field.value && 'text-slate-400')}>
                {t('buyer')}
              </FormLabel>
              <FormControl>
                <Switch
                  className="text-right !mt-0"
                  {...field}
                  tabIndex={tabIndex}
                  value={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel
                className={cn('transition-colors !mt-0', !field.value && 'text-slate-400')}
              >
                {t('supplier')}
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </Fieldset>
  )
}

export { PudratchiFields }
