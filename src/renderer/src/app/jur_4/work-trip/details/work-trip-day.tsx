import type { WorkTripFormValues } from '../config'
import type { MinimumWage } from '@/app/super-admin/spravochnik/minimum-wage/service'

import { useEffect } from 'react'

import { Plus, Trash2 } from 'lucide-react'
import { type UseFormReturn, useFieldArray, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { FormField } from '@/common/components/ui/form'
import { getWorkdaysInPeriod, parseDate } from '@/common/lib/date'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export interface WorkTripDaysProps {
  form: UseFormReturn<WorkTripFormValues>
  minimumWageQueryData: MinimumWage[]
}
export const WorkTripDays = ({ form, minimumWageQueryData }: WorkTripDaysProps) => {
  const { t } = useTranslation(['app'])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'day'
  })

  const values = useWatch({
    control: form.control,
    name: 'day'
  })

  const daysCount =
    form.watch('from_date') && form.watch('to_date')
      ? getWorkdaysInPeriod(parseDate(form.watch('from_date')), parseDate(form.watch('to_date')))
          .totalDays
      : 0

  useEffect(() => {
    const daySumma = values.reduce((acc, curr) => acc + (curr.summa || 0), 0)

    if (form.getValues('day_summa') !== daySumma) {
      form.setValue('day_summa', daySumma)
    }

    const childIndex = form.getValues('childs').findIndex((child) => child.type === 'day')
    if (childIndex !== -1 && form.getValues(`childs.${childIndex}.summa`) !== daySumma) {
      form.setValue(`childs.${childIndex}.summa`, daySumma)
    }
  }, [values, form])

  useEffect(() => {
    const days = form.getValues('day')
    if (days.length === 1) {
      if (days[0].day !== daysCount) {
        form.setValue('day.0.day', daysCount)
      }
    }
  }, [daysCount, form])

  return (
    <div className="space-y-1 py-2">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-2 bg-gray-50 border rounded-lg p-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <FormElement
              label={t('pages.bhm')}
              direction="column"
              className="w-full"
            >
              <FormField
                control={form.control}
                name={`day.${index}.minimum_wage_id`}
                render={({ field }) => (
                  <JollySelect
                    items={minimumWageQueryData}
                    selectedKey={field.value}
                    onSelectionChange={(value) => {
                      field.onChange(value)
                      const currentWage = minimumWageQueryData.find((item) => item.id === value)
                      if (currentWage) {
                        form.setValue(`day.${index}.minWageSumma`, currentWage.summa)
                      }

                      const newSumma =
                        (currentWage?.summa || 0) * 0.1 * (form.getValues(`day.${index}.day`) || 0)
                      form.setValue(`day.${index}.summa`, newSumma, {
                        shouldValidate: true
                      })
                    }}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    className="w-full max-w-[500px]"
                  >
                    {(item) => (
                      <SelectItem id={item.id}>
                        {formatNumber(item.summa)} №{item.doc_num} {formatLocaleDate(item.doc_date)}{' '}
                        - {t('starts').toLowerCase()} {formatLocaleDate(item.start)}
                      </SelectItem>
                    )}
                  </JollySelect>
                )}
              />
            </FormElement>
            <FormField
              control={form.control}
              name={`day.${index}.summa`}
              render={({ field }) => (
                <FormElement
                  label={t('summa')}
                  direction="column"
                  divProps={{
                    className: 'items-start'
                  }}
                >
                  <div>
                    <NumericInput
                      readOnly
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue)
                      }}
                    />
                    <div className="text-xs font-semibold text-slate-500 mt-2 flex flex-col justify-between items-end gap-1">
                      <p>
                        [{t('pages.bhm').toLowerCase()}] * 0.1 * [{t('days').toLowerCase()}]
                      </p>
                      <p>
                        {formatNumber(form.watch(`day.${index}.minWageSumma`) || 0)} * 0.1 *{' '}
                        {form.watch(`day.${index}.day`)}
                      </p>
                    </div>
                  </div>
                </FormElement>
              )}
            />

            <FormField
              control={form.control}
              name={`day.${index}.day`}
              render={({ field }) => (
                <FormElement
                  label={t('days')}
                  direction="column"
                >
                  <NumericInput
                    min={0}
                    max={daysCount}
                    value={field.value}
                    onValueChange={(values) => {
                      const newDay = values.floatValue || 0
                      field.onChange(newDay)

                      const currentWage = minimumWageQueryData.find(
                        (item) => item.id === form.getValues(`day.${index}.minimum_wage_id`)
                      )
                      const newSumma = (currentWage?.summa || 0) * 0.1 * newDay
                      form.setValue(`day.${index}.summa`, newSumma, {
                        shouldValidate: true
                      })
                    }}
                  />
                </FormElement>
              )}
            />

            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:!text-destructive ml-auto"
              onClick={() => {
                remove(index)
              }}
            >
              <Trash2 className="btn-icon" />
            </Button>
          </div>
        </div>
      ))}

      <div>
        <b>
          {t('total')} {formatNumber(values.reduce((acc, curr) => acc + (curr.summa || 0), 0))}
        </b>
      </div>

      <div className="pt-2.5 border-t">
        <Button
          onClick={() => {
            append({
              minimum_wage_id: 0,
              minWageSumma: 0,
              summa: 0,
              day: 1
            })
          }}
        >
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </div>
    </div>
  )
}
