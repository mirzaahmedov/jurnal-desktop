import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { SelectItem } from '@/common/components/jolly/select'
import { Form, FormField } from '@/common/components/ui/form'
import { useConstantsStore } from '@/common/features/constants/store'

import { DistanceFormSchema, DistanceQueryKeys, defaultValues } from './config'
import { useFromDistrictFilter, useToDistrictFilter } from './filters'
import { type Distance, DistanceService } from './service'

export interface MinimumWageEditModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: Distance | null
}
export const DistanceEditModal = ({ selected, ...props }: MinimumWageEditModalProps) => {
  const { t } = useTranslation(['app'])
  const { regions, districts } = useConstantsStore()

  const [fromRegionId, setFromRegionId] = useState<number | null>(null)
  const [toRegionId, setToRegionId] = useState<number | null>(null)

  const defaultFromDistrictId = useFromDistrictFilter()[0] ?? defaultValues.from_district_id
  const defaultToDistrictId = useToDistrictFilter()[0] ?? defaultValues.to_district_id
  const queryClient = useQueryClient()

  const { mutate: createDistance, isPending: isCreatingDistance } = useMutation({
    mutationFn: DistanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DistanceQueryKeys.GetAll]
      })
      props.onOpenChange?.(false)
    }
  })
  const { mutate: updateDistance, isPending: isUpdatingDistance } = useMutation({
    mutationFn: DistanceService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DistanceQueryKeys.GetAll]
      })
      props.onOpenChange?.(false)
    }
  })

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      from_district_id: defaultFromDistrictId,
      to_district_id: defaultToDistrictId
    },
    resolver: zodResolver(DistanceFormSchema)
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateDistance({
        id: selected.id,
        distance_km: values.distance_km
      })
    } else {
      createDistance({
        from_district_id: values.from_district_id,
        to_district_id: values.to_district_id,
        distance_km: values.distance_km
      })
    }
  })

  useEffect(() => {
    if (selected) {
      form.reset({
        from_district_id: selected.from_district_id,
        to_district_id: selected.to_district_id,
        distance_km: selected.distance_km
      })
    } else {
      form.reset({
        ...defaultValues,
        from_district_id: defaultFromDistrictId,
        to_district_id: defaultToDistrictId
      })
    }
  }, [form, selected, defaultFromDistrictId, defaultToDistrictId])

  useEffect(() => {
    if (props.isOpen) {
      setFromRegionId(null)
      setToRegionId(null)
    }
  }, [props.isOpen])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t('pages.distance')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="flex items-center gap-5">
                <div className="flex-1 space-y-5">
                  <div className="p-2 border rounded-xl">
                    <div className="grid grid-cols-3 gap-5 py-2.5 px-5 items-center">
                      <h5 className="text-sm font-bold">{t('from_where')}</h5>
                      <JollyComboBox
                        isReadOnly={!!selected}
                        defaultItems={regions}
                        label={t('region')}
                        selectedKey={fromRegionId}
                        onSelectionChange={(value) => setFromRegionId(value as number)}
                        menuTrigger="focus"
                        placeholder={t('region')}
                      >
                        {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
                      </JollyComboBox>
                      <FormField
                        control={form.control}
                        name="from_district_id"
                        render={({ field }) => (
                          <JollyComboBox
                            isReadOnly={!!selected}
                            defaultItems={
                              fromRegionId
                                ? districts.filter(
                                    (district) => district.region_id === fromRegionId
                                  )
                                : districts
                            }
                            label={t('district')}
                            selectedKey={field.value}
                            onSelectionChange={(value) => field.onChange(value as number)}
                            menuTrigger="focus"
                            placeholder={t('district')}
                          >
                            {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                          </JollyComboBox>
                        )}
                      />
                    </div>
                  </div>

                  <div className="p-2 border rounded-xl">
                    <div className="grid grid-cols-3 gap-5 py-2.5 px-5 items-center">
                      <h5 className="text-sm font-bold">{t('to_where')}</h5>
                      <JollyComboBox
                        isReadOnly={!!selected}
                        defaultItems={regions}
                        label={t('region')}
                        selectedKey={toRegionId}
                        onSelectionChange={(value) => setToRegionId(value as number)}
                        menuTrigger="focus"
                        placeholder={t('region')}
                      >
                        {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                      </JollyComboBox>
                      <FormField
                        control={form.control}
                        name="to_district_id"
                        render={({ field }) => (
                          <JollyComboBox
                            isReadOnly={!!selected}
                            defaultItems={
                              toRegionId
                                ? districts.filter((district) => district.region_id === toRegionId)
                                : districts
                            }
                            label={t('district')}
                            selectedKey={field.value}
                            onSelectionChange={(value) => field.onChange(value as number)}
                            menuTrigger="focus"
                            placeholder={t('district')}
                          >
                            {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                          </JollyComboBox>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-sm ml-auto">
                <FormField
                  control={form.control}
                  name="distance_km"
                  render={({ field }) => (
                    <FormElement label={t('distance')}>
                      <NumericInput
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                      />
                    </FormElement>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  isPending={isUpdatingDistance || isCreatingDistance}
                  type="submit"
                >
                  {t('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
