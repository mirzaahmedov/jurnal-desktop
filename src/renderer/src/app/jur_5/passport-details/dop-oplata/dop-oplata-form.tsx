import type { MainZarplata } from '@/common/models'

import { useState } from 'react'

import { Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
import { EmptyList } from '@/common/components/empty-states'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { parseDate } from '@/common/lib/date'

import { defaultValues } from './config'
import { DopOplataTabOptions } from './dialog'

export interface DopOplataFormProps {
  tabValue: DopOplataTabOptions
  mainZarplata: MainZarplata
}
export const DopOplataForm = ({ mainZarplata, tabValue }: DopOplataFormProps) => {
  const { t } = useTranslation(['app'])

  const [summa, setSumma] = useState(0)
  const [resultSumma, setResultSumma] = useState(0)
  const [percent, setPercent] = useState(0)

  const form = useForm({
    defaultValues
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'childs'
  })

  const handleSubmit = form.handleSubmit((values) => {
    console.log({ values })
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col overflow-hidden divide-y"
      >
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar p-5">
          <FormElement
            controlled={false}
            label={t('fio')}
            divProps={{
              className: 'items-start'
            }}
          >
            <Textarea
              value={mainZarplata.fio}
              spellCheck={false}
            />
          </FormElement>
          <FormField
            control={form.control}
            name="docDate"
            render={({ field }) => (
              <FormElement
                label={t('date')}
                className="w-32"
              >
                <JollyDatePicker {...field} />
              </FormElement>
            )}
          />
          <div className="flex items-center justify-end gap-2">
            {tabValue === DopOplataTabOptions.AnnualLeave ? (
              <JollySelect
                items={[
                  {
                    value: 60
                  },
                  {
                    value: 80
                  },
                  {
                    value: 100
                  }
                ]}
                className="w-24"
                placeholder=""
                selectedKey={percent}
                onSelectionChange={(value) => setPercent((value as number) ?? 0)}
              >
                {(item) => <SelectItem id={item.value}>{item.value}%</SelectItem>}
              </JollySelect>
            ) : null}
            <NumericInput
              value={summa}
              onValueChange={(values) => setSumma(values.floatValue ?? 0)}
              className="w-32"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const endDate = parseDate(form.getValues('docDate'))
                  const startDate = new Date()

                  let days = 0
                  if (endDate && startDate && endDate.getTime() > startDate.getTime()) {
                    days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
                  }

                  append({
                    name: '',
                    period: days,
                    summa
                  })
                }
              }}
            />
            <span>=</span>
            <NumericInput
              readOnly
              value={resultSumma}
              onValueChange={(values) => setResultSumma(values.floatValue ?? 0)}
              className="w-32"
            />
          </div>

          <div className="divide-y space-y-1 mt-5">
            <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_40px] items-center px-2 py-2 gap-2 font-semibold text-sm bg-gray-100">
              <h5></h5>
              <h5 className="col-span-2">{t('name')}</h5>
              <h5>{t('period')}</h5>
              <h5>{t('summa')}</h5>
            </div>
            {fields.length ? (
              fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_40px] items-center px-2 py-1 gap-2"
                >
                  <div>{index + 1}</div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`childs.${index}.name`}
                      render={({ field }) => <Input {...field} />}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name={`childs.${index}.name`}
                      render={({ field }) => (
                        <NumericInput
                          ref={field.ref}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name={`childs.${index}.summa`}
                      render={({ field }) => (
                        <NumericInput
                          ref={field.ref}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(index)}
                      className="text-destructive hover:!text-destructive"
                    >
                      <Trash2 className="btn-icon " />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-5">
                <EmptyList className="mx-auto max-w-52 text-xs" />
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pt-5">
          <Button type="submit">{t('save')}</Button>
        </div>
      </form>
    </Form>
  )
}
