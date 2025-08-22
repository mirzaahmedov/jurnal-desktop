import type { FormEditableFieldsComponent } from './types'
import type { DayPickerSingleProps } from 'react-day-picker'
import type { Control, UseFormReturn } from 'react-hook-form'

import { useEffect } from 'react'

import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Fieldset, Spinner } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/ui/button'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { type DocumentType, useGenerateDocumentNumber } from '@/common/features/doc-num'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatDate, parseDate } from '@/common/lib/date'
import { cn } from '@/common/lib/utils'

interface RequiredDocumentFields {
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

  const typedForm = form as unknown as UseFormReturn<RequiredDocumentFields>
  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)

  const { isPending, fetchDocumentNumberAsync } = useGenerateDocumentNumber({
    documentType: documentType!,
    onChange: () => {},
    enabled: autoGenerate && !!documentType
  })

  useEffect(() => {
    const doc_date = form.getValues('doc_date' as any)
    if (doc_date && calendarProps?.fromMonth) {
      const date = parseDate(doc_date)
      if (date < calendarProps.fromMonth) {
        form.setValue('doc_date' as any, formatDate(calendarProps.fromMonth) as any)
      }
    }
    if (doc_date && calendarProps?.toMonth) {
      const date = parseDate(doc_date)
      if (date > calendarProps.toMonth) {
        form.setValue(
          'doc_date' as any,
          formatDate(calendarProps.fromMonth ?? calendarProps.toMonth) as any
        )
      }
    }
  }, [form, calendarProps?.fromMonth, calendarProps?.toMonth])

  useEffect(() => {
    if (!documentType) {
      return
    }
    fetchDocumentNumberAsync({
      type: documentType,
      main_schet_id: mainSchetId
    }).then((docNum) => {
      const prevDocNum = typedForm.watch()
      if (prevDocNum || !docNum) {
        return
      }
      typedForm.setValue('doc_num', docNum ? docNum.toString() : '')
    })
  }, [fetchDocumentNumberAsync, documentType, mainSchetId])

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
              className="flex-1 max-w-sm min-w-48"
              direction={dialog ? 'column' : 'row'}
            >
              <div className="flex items-center gap-1">
                <Input
                  autoFocus
                  tabIndex={tabIndex}
                  disabled={disabled}
                  {...field}
                />
                {documentType && autoGenerate ? (
                  <Button
                    type="button"
                    size="icon"
                    className="size-10 flex-shrink-0"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => {
                      if (!documentType) {
                        return
                      }
                      fetchDocumentNumberAsync({
                        type: documentType,
                        main_schet_id: mainSchetId
                      }).then((docNum) => {
                        if (!docNum) {
                          return
                        }
                        typedForm.setValue('doc_num', docNum ? docNum.toString() : '')
                      })
                    }}
                  >
                    {isPending ? <Spinner className="size-5 border-2" /> : <RefreshCw />}
                  </Button>
                ) : null}
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
              <JollyDatePicker
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
