import type { ShartnomaForm } from '../service'
import type { FormEditableFieldsComponent } from '@/common/widget/form'
import type { Control } from 'react-hook-form'

import { Fieldset } from '@/common/components'
import { FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { Switch } from '@/common/components/ui/switch'
import { cn } from '@/common/lib/utils'

const PudratchiFields: FormEditableFieldsComponent<ShartnomaForm> = ({ form, name, ...props }) => {
  return (
    <Fieldset {...props} name={name ?? ''}>
      <div className="flex items-start gap-5">
        <FormField
          name="pudratchi_bool"
          control={form.control as unknown as Control<ShartnomaForm>}
          render={({ field }) => (
            <FormItem className="flex items-center gap-5">
              <FormLabel className={cn('transition-colors', field.value && 'text-slate-400')}>
                Поставщик
              </FormLabel>
              <FormControl>
                <Switch
                  className="text-right !mt-0"
                  {...field}
                  value={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel
                className={cn('transition-colors !mt-0', !field.value && 'text-slate-400')}
              >
                Покупатель
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </Fieldset>
  )
}

export { PudratchiFields }
