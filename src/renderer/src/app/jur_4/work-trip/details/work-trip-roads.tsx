import type { WorkTripFormValues } from '../config'

import { useEffect } from 'react'

import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Calculator, Plus, Trash2 } from 'lucide-react'
import { type UseFormReturn, useFieldArray, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DistanceService } from '@/app/super-admin/spravochnik/distance/service'
import { NumericInput, Spinner } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import { FormField, FormLabel, FormMessage } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useConstantsStore } from '@/common/features/constants/store'
import { formatNumber } from '@/common/lib/format'

import { calcRoadSumma } from './utils'

export interface WorkTripRoadsProps {
  form: UseFormReturn<WorkTripFormValues>
  minimumWageSumma: number
}
export const WorkTripRoads = ({ form, minimumWageSumma }: WorkTripRoadsProps) => {
  const { t } = useTranslation(['app'])
  const { regions } = useConstantsStore()

  const { mutateAsync: getDistanceKM, isPending: isGettingDistance } = useMutation({
    mutationFn: DistanceService.getDistanceKM,
    onError: () => {
      toast.error(t('errors.no_distance'))
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'road'
  })

  const roads = useWatch({
    control: form.control,
    name: 'road'
  })

  useEffect(() => {
    roads.forEach((road, index) => {
      if (road.road_ticket_number) {
        return
      }
      const roadSumma = calcRoadSumma({
        distanceKM: road.km,
        minimumWageSumma: minimumWageSumma
      })
      if (roadSumma !== road.road_summa) {
        form.setValue(`road.${index}.road_summa`, roadSumma, {
          shouldValidate: true
        })
      }
      console.log('road summa', roadSumma)
    })
  }, [roads, minimumWageSumma])

  return (
    <div className="space-y-1 py-2">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-5 bg-gray-50 border rounded-lg p-5"
        >
          <div className="flex flex-wrap items-center justify-start gap-2">
            <FormField
              control={form.control}
              name={`road.${index}.from_region_id`}
              render={({ field, fieldState }) => (
                <div>
                  <JollyComboBox
                    defaultItems={regions}
                    selectedKey={field.value}
                    onSelectionChange={(from_region_id) => {
                      if (
                        (from_region_id as number) >= 1 &&
                        form.getValues(`road.${index}.to_region_id`) >= 1
                      ) {
                        getDistanceKM({
                          from_region_id: from_region_id as number,
                          to_region_id: form.getValues(`road.${index}.to_region_id`)
                        }).then((km) => {
                          form.setValue(`road.${index}.km`, km)
                          form.setValue(`road.${index}.road_summa`, minimumWageSumma * 0.001 * km, {
                            shouldValidate: true
                          })
                        })
                      }
                      field.onChange(from_region_id)
                    }}
                    menuTrigger="focus"
                    placeholder={t('region_alt')}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    className="w-48 gap-0"
                  >
                    {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                  </JollyComboBox>
                  <FormMessage />
                </div>
              )}
            />
            <ArrowRight className="btn-icon" />
            <FormField
              control={form.control}
              name={`road.${index}.to_region_id`}
              render={({ field, fieldState }) => (
                <div>
                  <JollyComboBox
                    defaultItems={regions}
                    selectedKey={field.value}
                    onSelectionChange={(to_region_id) => {
                      if (
                        (to_region_id as number) >= 1 &&
                        form.getValues(`road.${index}.from_region_id`) >= 1
                      ) {
                        getDistanceKM({
                          to_region_id: to_region_id as number,
                          from_region_id: form.getValues(`road.${index}.from_region_id`)
                        }).then((km) => {
                          form.setValue(`road.${index}.km`, km)
                        })
                      }
                      field.onChange(to_region_id)
                    }}
                    menuTrigger="focus"
                    placeholder={t('region_alt')}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    className="w-48 gap-0"
                  >
                    {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                  </JollyComboBox>
                  <FormMessage />
                </div>
              )}
            />
            <div className="flex-1 flex items-center justify-end">
              <FormField
                control={form.control}
                name={`road.${index}.km`}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <FormLabel>{t('distance')}</FormLabel>
                    <NumericInput
                      readOnly
                      className="w-24"
                      value={field.value}
                    />
                  </div>
                )}
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:!text-destructive"
              onClick={() => {
                remove(index)
              }}
            >
              <Trash2 className="btn-icon" />
            </Button>
          </div>
          <div className="flex items-start gap-5">
            <FormField
              control={form.control}
              name={`road.${index}.road_ticket_number`}
              render={({ field }) => (
                <FormElement
                  label={t('road_ticket_number')}
                  direction="column"
                  divProps={{
                    className: 'gap-3'
                  }}
                >
                  <Input {...field} />
                </FormElement>
              )}
            />
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`road.${index}.road_summa`}
                render={({ field }) => (
                  <FormElement
                    label={t('summa')}
                    direction="column"
                    divProps={{
                      className: 'gap-3'
                    }}
                  >
                    <div className="w-full flex items-start gap-2.5">
                      <div className="flex-1 max-w-md">
                        <NumericInput
                          disabled={isGettingDistance}
                          readOnly={!form.watch(`road.${index}.road_ticket_number`)}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                        {!form.watch(`road.${index}.road_ticket_number`) ? (
                          <div className="text-xs font-semibold text-slate-500 mt-2 flex items-start justify-between gap-1">
                            <p>
                              [{t('pages.bhm').toLowerCase()}] * 0.001 * [
                              {t('distance').toLowerCase()}]
                            </p>
                            <p>
                              {formatNumber(minimumWageSumma)} * 0.001 *{' '}
                              {form.watch(`road.${index}.km`) ?? 0}
                            </p>
                          </div>
                        ) : null}
                      </div>

                      {isGettingDistance ? (
                        <Spinner />
                      ) : !form.watch(`road.${index}.road_ticket_number`) ? (
                        <Button
                          size="icon"
                          className="shrink-0"
                        >
                          <Calculator className="btn-icon" />
                        </Button>
                      ) : null}
                    </div>
                  </FormElement>
                )}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="pt-2.5 border-t">
        <Button
          onClick={() => {
            append({
              road_ticket_number: '',
              from_region_id: -1,
              to_region_id: -1,
              km: 0,
              road_summa: 0
            })
          }}
        >
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </div>
    </div>
  )
}
