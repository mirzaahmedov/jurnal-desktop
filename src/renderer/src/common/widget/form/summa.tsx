import type { FormFieldsComponent } from './types'

import { useTranslation } from 'react-i18next'

import { Fieldset, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { formatNumber } from '@/common/lib/format'
import { cn, numberToWords } from '@/common/lib/utils'

export const SummaFields: FormFieldsComponent<
  {
    summa?: number
    contractSumma?: number
    dialog?: boolean
    percentage?: number
  },
  HTMLInputElement,
  {
    dialog?: boolean
    percentage?: boolean
    onChangePercentage?: (value: number) => void
  }
> = ({ data, dialog = false, percentage = 0, name, onChangePercentage, ...props }) => {
  const { t, i18n } = useTranslation()
  return (
    <Fieldset
      {...props}
      className={cn(dialog && 'p-0', props.className)}
      name={name ?? t('summa')}
    >
      <div className={cn('flex items-start flex-wrap gap-5', dialog && 'flex-col items-stretch')}>
        <div className="flex flex-col items-end">
          <FormElement label={t('summa')}>
            <Input
              readOnly
              tabIndex={-1}
              value={formatNumber(data?.summa ?? 0)}
              className="text-slate-600 text-right text-lg font-bold"
            />
          </FormElement>
        </div>

        <Textarea
          readOnly
          tabIndex={-1}
          rows={3}
          className="flex-1"
          value={numberToWords(data?.summa ?? 0, i18n.language)}
        />

        {percentage ? (
          <div className="mt-2 w-full flex items-center gap-2 flex-wrap">
            <FormElement label={t('shartnoma_summa')}>
              <NumericInput
                readOnly
                tabIndex={-1}
                value={data?.contractSumma ?? 0}
              />
            </FormElement>
            <FormElement label={t('payment_percent')}>
              <NumericInput
                tabIndex={-1}
                value={data?.percentage ?? 0}
                onValueChange={(values) => onChangePercentage?.(values.floatValue ?? 0)}
                className="w-32"
              />
            </FormElement>
          </div>
        ) : null}
      </div>
    </Fieldset>
  )
}
