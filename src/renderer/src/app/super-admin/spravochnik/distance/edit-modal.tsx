import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

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
import { Form, FormField } from '@/common/components/ui/form'
import { useConstantsStore } from '@/common/features/constants/store'

import { DistanceFormSchema, DistanceQueryKeys, defaultValues } from './config'
import { type Distance, DistanceService } from './service'

export interface MinimumWageEditModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: Distance | null
}
export const DistanceEditModal = ({ selected, ...props }: MinimumWageEditModalProps) => {
  const { t } = useTranslation(['app'])
  const { regions } = useConstantsStore()

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
    defaultValues,
    resolver: zodResolver(DistanceFormSchema)
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (!selected) {
      if (!values.from_region_id) {
        form.setError('from_region_id', { type: 'required', message: t('required_field') })
        return
      }
      if (!values.to_region_id) {
        form.setError('to_region_id', { type: 'required', message: t('required_field') })
        return
      }
    }
    if (selected) {
      updateDistance({
        id: selected.id,
        distance_km: values.distance_km
      })
    } else {
      createDistance({
        from_region_id: values.from_region_id,
        to_region_id: values.to_region_id,
        distance_km: values.distance_km
      })
    }
  })

  useEffect(() => {
    if (selected) {
      form.reset({
        from_region_id: selected.from_region_id,
        to_region_id: selected.to_region_id,
        distance_km: selected.distance_km
      })
    } else {
      form.reset(defaultValues)
    }
  }, [form, selected])

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
                    <div className="grid grid-cols-2 gap-5 py-2.5 px-5 items-center">
                      <h5 className="text-sm font-bold">{t('from_where')}</h5>
                      <FormField
                        control={form.control}
                        name="from_region_id"
                        render={({ field, fieldState }) => (
                          <JollyComboBox
                            isReadOnly={!!selected}
                            defaultItems={regions}
                            label={t('region')}
                            selectedKey={field.value}
                            onSelectionChange={(value) => field.onChange(value as number)}
                            menuTrigger="focus"
                            placeholder={t('region')}
                            errorMessage={fieldState.error?.message}
                            isInvalid={!!fieldState.error}
                          >
                            {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
                          </JollyComboBox>
                        )}
                      />
                    </div>
                  </div>

                  <div className="p-2 border rounded-xl">
                    <div className="grid grid-cols-2 gap-5 py-2.5 px-5 items-center">
                      <h5 className="text-sm font-bold">{t('to_where')}</h5>
                      <FormField
                        control={form.control}
                        name="to_region_id"
                        render={({ field, fieldState }) => (
                          <JollyComboBox
                            isReadOnly={!!selected}
                            defaultItems={regions}
                            label={t('region')}
                            selectedKey={field.value}
                            onSelectionChange={(value) => field.onChange(value as number)}
                            menuTrigger="focus"
                            placeholder={t('region')}
                            errorMessage={fieldState.error?.message}
                            isInvalid={!!fieldState.error}
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
