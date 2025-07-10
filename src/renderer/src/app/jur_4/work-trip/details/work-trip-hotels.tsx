import type { WorkTripFormValues } from '../config'

import { Plus, Trash2 } from 'lucide-react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

export interface WorkTripHotelsProps {
  form: UseFormReturn<WorkTripFormValues>
}
export const WorkTripHotels = ({ form }: WorkTripHotelsProps) => {
  const { t } = useTranslation(['app'])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'hotel'
  })

  return (
    <div className="space-y-1 py-2">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-2 bg-gray-50 border rounded-lg p-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <FormField
              control={form.control}
              name={`hotel.${index}.hostel_ticket_number`}
              render={({ field }) => (
                <FormElement
                  label={t('hotel_number')}
                  direction="column"
                  divProps={{
                    className: 'gap-3'
                  }}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name={`hotel.${index}.day`}
              render={({ field }) => (
                <FormElement
                  label={t('days')}
                  direction="column"
                  divProps={{
                    className: 'gap-3'
                  }}
                >
                  <Input
                    type="number"
                    value={field.value}
                    className="w-24"
                    onChange={(e) => {
                      const days = parseInt(e.target.value, 10)
                      const daySumma = form.getValues(`hotel.${index}.day_summa`) || 0
                      field.onChange(days)
                      form.setValue(`hotel.${index}.hostel_summa`, days * daySumma || 0)
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

          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            <FormField
              control={form.control}
              name={`hotel.${index}.day_summa`}
              render={({ field }) => (
                <FormElement
                  label={t('day_summa')}
                  direction="column"
                  divProps={{
                    className: 'gap-3'
                  }}
                >
                  <NumericInput
                    value={field.value}
                    onValueChange={(values) => {
                      const daySumma = values.floatValue ?? 0
                      const days = form.getValues(`hotel.${index}.day`) || 0
                      field.onChange(daySumma)
                      form.setValue(`hotel.${index}.hostel_summa`, days * daySumma || 0)
                    }}
                  />
                </FormElement>
              )}
            />

            <FormField
              control={form.control}
              name={`hotel.${index}.hostel_summa`}
              render={({ field }) => (
                <FormElement
                  label={t('summa')}
                  direction="column"
                  divProps={{
                    className: 'gap-3'
                  }}
                >
                  <NumericInput
                    value={field.value}
                    onValueChange={(values) => {
                      const hostelSumma = values.floatValue ?? 0
                      field.onChange(hostelSumma)
                      const days = form.getValues(`hotel.${index}.day`) || 0
                      form.setValue(`hotel.${index}.day_summa`, Math.round(hostelSumma / days))
                    }}
                  />
                </FormElement>
              )}
            />
          </div>
        </div>
      ))}

      <div className="pt-2.5 border-t">
        <Button
          onClick={() => {
            append({
              hostel_ticket_number: '',
              day: 0,
              day_summa: 0,
              hostel_summa: 0
            })
          }}
        >
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </div>
    </div>
  )
}
