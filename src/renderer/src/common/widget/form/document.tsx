import type { FormEditableFieldsComponent } from './types'
import type { DayPickerSingleProps } from 'react-day-picker'
import type { Control, UseFormReturn } from 'react-hook-form'

import { Button } from '@renderer/common/components/ui/button'
import { type DocumentType, useGenerateDocumentNumber } from '@renderer/common/features/doc-num'
import { cn } from '@renderer/common/lib/utils'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DatePicker, Fieldset, Spinner } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

type RequiredDocumentFields = {
  doc_num: string
  doc_date: string
}

export const DocumentFields: FormEditableFieldsComponent<
  RequiredDocumentFields,
  {
    validateDate?: (value: string) => boolean
    calendarProps?: Omit<DayPickerSingleProps, 'mode'>
    documentType?: DocumentType
    autoGenerate?: boolean
  }
> = ({
  tabIndex,
  name,
  form,
  disabled,
  dialog = false,
  validateDate,
  calendarProps,
  documentType,
  autoGenerate = false,
  ...props
}) => {
  const { t } = useTranslation()

  const { refetch, isFetching } = useGenerateDocumentNumber({
    documentType: documentType!,
    onChange: (doc_num) => {
      // Todo: fix this
      if (!(form as unknown as UseFormReturn<RequiredDocumentFields>).getValues('doc_num')) {
        ;(form as unknown as UseFormReturn<RequiredDocumentFields>).setValue(
          'doc_num',
          doc_num ? doc_num.toString() : ''
        )
      }
    },
    enabled: autoGenerate && !!documentType
  })

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
              className="flex-1 max-w-sm"
              direction={dialog ? 'column' : 'row'}
            >
              <div className="flex items-center gap-1">
                <Input
                  autoFocus
                  tabIndex={tabIndex}
                  disabled={disabled}
                  {...field}
                />
                <Button
                  type="button"
                  size="icon"
                  className="size-10 flex-shrink-0"
                  variant="outline"
                  disabled={isFetching}
                  onClick={() => {
                    refetch()
                  }}
                >
                  {isFetching ? <Spinner className="size-5 border-2" /> : <RefreshCw />}
                </Button>
              </div>
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
                validate={validateDate}
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
