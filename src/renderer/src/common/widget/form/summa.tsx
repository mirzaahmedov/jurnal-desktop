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
    percent?: number
  },
  HTMLInputElement,
  {
    dialog?: boolean
    percent?: boolean
    percentReadOnly?: boolean
    onChangePercentage?: (value: number) => void
  }
> = ({
  data,
  dialog = false,
  percent = false,
  percentReadOnly = false,
  name,
  onChangePercentage,
  ...props
}) => {
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

        {percent && data?.contractSumma ? (
          <div className="mt-2 w-full flex items-start gap-5 flex-wrap">
            <FormElement label={t('shartnoma')}>
              <NumericInput
                readOnly
                tabIndex={-1}
                value={data.contractSumma ?? 0}
                className="w-48"
              />
            </FormElement>
            <FormElement label={t('payment_percent')}>
              <NumericInput
                readOnly={percentReadOnly}
                tabIndex={-1}
                value={data?.percent ?? 0}
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
