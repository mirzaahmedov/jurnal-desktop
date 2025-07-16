import { useEffect } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler,
  createEditorDuplicateHandler
} from '@/common/components/editable-table/helpers'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { MonthSelect } from '@/common/components/month-select'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { YearSelect } from '@/common/components/year-select'
import { formatLocaleDate } from '@/common/lib/format'

import { type TabelFormValues, defaultValues } from './config'
import { provodkaColumns } from './provodka-columns'
import { TabelService } from './service'

export interface TabelFormProps {
  budjetId: number
  mainSchetId: number
  isPending?: boolean
  onSubmit: (values: TabelFormValues) => void
}
export const TabelForm = ({ budjetId, mainSchetId, isPending, onSubmit }: TabelFormProps) => {
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues
  })

  const { mutate: getMaxDocNum } = useMutation({
    mutationFn: TabelService.getMaxDocNum,
    onSuccess: (docNum) => {
      form.setValue('docNum', docNum)
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      docDate: formatLocaleDate(values.docDate),
      spravochnikBudjetNameId: budjetId,
      mainSchetId
    })
  })

  useEffect(() => {
    getMaxDocNum()
  }, [getMaxDocNum])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="relative h-full flex flex-col overflow-hidden divide-y"
      >
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar p-5">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            <FormField
              control={form.control}
              name="docNum"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('doc_num')}
                >
                  <Input
                    readOnly
                    {...field}
                  />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="docDate"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('doc_date')}
                >
                  <JollyDatePicker
                    readOnly
                    {...field}
                  />
                </FormElement>
              )}
            />

            <FormField
              control={form.control}
              name="tabelYear"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('year')}
                >
                  <YearSelect
                    isReadOnly
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="tabelMonth"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('month')}
                >
                  <MonthSelect
                    isReadOnly
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  />
                </FormElement>
              )}
            />
          </div>

          <div className="col-span-2 mt-5">
            <EditableTable
              columnDefs={provodkaColumns}
              form={form}
              name="tabelChildren"
              onCreate={createEditorCreateHandler({
                defaultValues: defaultValues.tabelChildren[0],
                form
              })}
              onDelete={createEditorDeleteHandler({
                form
              })}
              onDuplicate={createEditorDuplicateHandler({
                form
              })}
            />
          </div>
        </div>

        <div className="px-5 pt-5">
          <Button
            type="submit"
            isPending={isPending}
          >
            {t('save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
