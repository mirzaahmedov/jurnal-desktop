import type { FormFieldsComponent } from './types'

import { useEffect, useState } from 'react'

import { Calculator } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Fieldset, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { useToggle } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'
import { cn, numberToWords } from '@/common/lib/utils'

export const SummaFields: FormFieldsComponent<
  {
    summa?: number
    summaContarct?: number
    dialog?: boolean
  },
  HTMLInputElement,
  {
    dialog?: boolean
    onSubmitSumma?: (value: number) => void
  }
> = ({ data, dialog = false, onSubmitSumma, name, ...props }) => {
  const { t, i18n } = useTranslation()

  const [percent, setPercent] = useState(0)

  const popoverToggle = useToggle()

  useEffect(() => {
    if (!popoverToggle.isOpen) {
      setPercent(100)
    }
  }, [popoverToggle.isOpen])

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

        {data?.summaContarct ? (
          <div className="mt-2 w-full flex items-start gap-5 flex-wrap">
            <FormElement label={t('shartnoma')}>
              <NumericInput
                readOnly
                tabIndex={-1}
                value={data.summaContarct ?? 0}
                className="w-48"
              />
            </FormElement>
            <PopoverTrigger
              isOpen={popoverToggle.isOpen}
              onOpenChange={popoverToggle.setOpen}
            >
              <Button
                variant="outline"
                size="icon"
                onPress={popoverToggle.open}
              >
                <Calculator className="btn-icon" />
              </Button>
              <Popover>
                <PopoverDialog>
                  <FormElement label={t('payment_percent')}>
                    <NumericInput
                      tabIndex={-1}
                      value={percent}
                      onValueChange={(values) => setPercent?.(values.floatValue ?? 0)}
                      className="w-32"
                    />
                  </FormElement>
                  <div className="flex justify-end">
                    <Button
                      isDisabled={percent === 0}
                      type="button"
                      onPress={() => {
                        onSubmitSumma?.(((data?.summaContarct ?? 0) * percent) / 100)
                      }}
                    >
                      {t('confirm')}
                    </Button>
                  </div>
                </PopoverDialog>
              </Popover>
            </PopoverTrigger>
          </div>
        ) : null}
      </div>
    </Fieldset>
  )
}
