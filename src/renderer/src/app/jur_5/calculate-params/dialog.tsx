import type { CalculateParams } from '@/common/models/calculate-params'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { MonthSelect } from '@/common/components/month-select'
import { Form, FormField } from '@/common/components/ui/form'
import { YearSelect } from '@/common/components/year-select'
import { getWorkdaysInMonth } from '@/common/lib/date'

import { CalculateParamsFormSchema, defaultValues } from './config'
import { CalculateParamsService } from './service'

export interface CalculateParamsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected?: CalculateParams
}
export const CalculateParamsDialog = ({ selected, ...props }: CalculateParamsDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const { mutate: createParams, isPending: isCreating } = useMutation({
    mutationFn: CalculateParamsService.createCalcParameters,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [CalculateParamsService.QueryKeys.GetAll]
      })
      props?.onOpenChange?.(false)
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const { mutate: updateParams, isPending: isUpdating } = useMutation({
    mutationFn: CalculateParamsService.updateCalcParameters,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [CalculateParamsService.QueryKeys.GetAll]
      })
      props?.onOpenChange?.(false)
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const form = useForm({
    defaultValues,
    resolver: zodResolver(CalculateParamsFormSchema)
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateParams({ id: selected.id, values })
    } else {
      createParams(values)
    }
  })

  const handleCalculateDays = () => {
    const year = form.getValues('year')
    const month = form.getValues('month')
    if (year && month) {
      form.setValue('dni5', getWorkdaysInMonth(year, month, 5).workdays)
      form.setValue('chasi5', getWorkdaysInMonth(year, month, 5).workhours)
      form.setValue('dni6', getWorkdaysInMonth(year, month, 6).workdays)
      form.setValue('chasi6', getWorkdaysInMonth(year, month, 6).workhours)
      form.setValue('dni7', getWorkdaysInMonth(year, month, 7).workdays)
      form.setValue('chasi7', getWorkdaysInMonth(year, month, 7).workhours)
    }
  }

  useEffect(() => {
    if (selected) {
      form.reset(selected)
    } else {
      form.reset(defaultValues)
    }
  }, [form, selected])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-4xl h-full max-h-[850px] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{t('pages.calc_parameters')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex-1 min-h-0 w-full overflow-hidden flex flex-col"
            >
              <div className="flex-1 w-full overflow-y-auto overflow-x-clip scrollbar grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 p-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormElement
                      label={t('year')}
                      grid="1:1"
                    >
                      <YearSelect
                        selectedKey={field.value}
                        onSelectionChange={(value) => {
                          field.onChange(value ?? 0)
                          handleCalculateDays()
                        }}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormElement
                      label={t('month')}
                      grid="1:1"
                    >
                      <MonthSelect
                        selectedKey={field.value}
                        onSelectionChange={(value) => {
                          field.onChange(value ?? 0)
                          handleCalculateDays()
                        }}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minZar"
                  render={({ field }) => (
                    <FormElement
                      label={t('min_salary')}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => {
                          const value = values.floatValue ?? 0
                          field.onChange(value)
                          form.setValue('poek', value * 3.23)
                        }}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mZpGod"
                  render={({ field }) => (
                    <FormElement
                      label={t('min_salary_year')}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neobMin"
                  render={({ field }) => (
                    <FormElement
                      label={t('min_salary_nontax')}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zaProezd"
                  render={({ field }) => (
                    <FormElement
                      label={t('for_ride')}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dni5"
                  render={({ field }) => (
                    <FormElement
                      label={`${t('days')} (5)`}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chasi5"
                  render={({ field }) => (
                    <FormElement
                      label={`${t('hours')} (5)`}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dni6"
                  render={({ field }) => (
                    <FormElement
                      label={`${t('days')} (6)`}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chasi6"
                  render={({ field }) => (
                    <FormElement
                      label={`${t('hours')} (6)`}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dni7"
                  render={({ field }) => (
                    <FormElement
                      label={`${t('days')} (7)`}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chasi7"
                  render={({ field }) => (
                    <FormElement
                      label={`${t('hours')} (7)`}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vrach"
                  render={({ field }) => (
                    <FormElement
                      label={t('doctor')}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medSes"
                  render={({ field }) => (
                    <FormElement
                      label={t('nurse')}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poek"
                  render={({ field }) => (
                    <FormElement
                      label={t('poek')}
                      grid="1:1"
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <FormField
                    key={`pr${n}`}
                    control={form.control}
                    name={`pr${n}`}
                    render={({ field }) => (
                      <FormElement
                        label={t('pr_nth', { nth: n })}
                        grid="1:1"
                      >
                        <NumericInput
                          ref={field.ref}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
                        />
                      </FormElement>
                    )}
                  />
                ))}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  isPending={isCreating || isUpdating}
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
