import type { FormFieldsComponent } from './types'

import { useTranslation } from 'react-i18next'

import { Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { formatNumber } from '@/common/lib/format'
import { cn, numberToWords } from '@/common/lib/utils'

export const SummaFields: FormFieldsComponent<
  {
    summa?: number
    dialog?: boolean
  },
  HTMLInputElement,
  {
    dialog?: boolean
  }
> = ({ data, dialog = false, name, ...props }) => {
  const { t } = useTranslation()
  return (
    <Fieldset
      {...props}
      className={cn(dialog && 'p-0', props.className)}
      name={name ?? t('summa')}
    >
      <div className={cn('flex items-start gap-5', dialog && 'flex-col items-stretch')}>
        <FormElement label={t('summa')}>
          <Input
            readOnly
            tabIndex={-1}
            value={formatNumber(data?.summa ?? 0)}
            className="text-slate-600 text-right text-lg font-bold"
          />
        </FormElement>

        <Textarea
          readOnly
          tabIndex={-1}
          className="flex-1"
          value={numberToWords(data?.summa ?? 0)}
        />
      </div>
    </Fieldset>
  )
}
