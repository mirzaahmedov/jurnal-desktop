import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, getMonthsInPeriod, parseLocaleDate } from '@/common/lib/date'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AlimentDeduction } from '@/common/models/payroll-deduction'
import { AlimentDeductionService } from './service'
import { Button } from '@/common/components/jolly/button'
import type { DialogTriggerProps } from 'react-aria-components'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { NumericInput } from '@/common/components'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { defaultValues } from './config'
import { formatLocaleDate } from '@/common/lib/format'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface AlimentDeductionDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplataId: number
  deductionId: number
  alimentDeductionData?: AlimentDeduction
}
export const AlimentDeductionDialog = ({
  mainZarplataId,
  deductionId,
  alimentDeductionData,
  ...props
}: AlimentDeductionDialogProps) => {
  const { t } = useTranslation(['app'])

  const [monthCount, setMonthCount] = useState(0)

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: defaultValues
  })

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('organizationId'),
      onChange: (value) => form.setValue('organizationId', value ?? 0, { shouldValidate: true })
    })
  )

  const alimentDeductionCreateMutation = useMutation({
    mutationFn: AlimentDeductionService.create,
    onSuccess: () => {
      props?.onOpenChange?.(false)
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [AlimentDeductionService.QueryKeys.GetAll, { mainId: mainZarplataId }]
      })
    }
  })

  const alimentDeductionUpdateMutation = useMutation({
    mutationFn: AlimentDeductionService.update,
    onSuccess: () => {
      props?.onOpenChange?.(false)
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [AlimentDeductionService.QueryKeys.GetAll, { mainId: mainZarplataId }]
      })
    }
  })

  const handleSubmit = () => {
    const values = form.getValues()

    if (alimentDeductionData) {
      alimentDeductionUpdateMutation.mutate({
        id: alimentDeductionData.id,
        values: {
          ...values,
          dateStart: formatLocaleDate(values.dateStart),
          dateFinish: formatLocaleDate(values.dateFinish),
          deductionId
        }
      })
    } else {
      alimentDeductionCreateMutation.mutate({
        deductionId,
        mainZarplataId,
        cardNumber: values.cardNumber,
        poluchatelFio: values.poluchatelFio,
        organizationId: values.organizationId,
        totalAmount: values.totalAmount,
        dateStart: formatLocaleDate(values.dateStart),
        dateFinish: formatLocaleDate(values.dateFinish),
        monthlyAmount: values.monthlyAmount
      })
    }
  }

  useEffect(() => {
    if (alimentDeductionData) {
      form.reset({
        cardNumber: alimentDeductionData.cardNumber,
        poluchatelFio: alimentDeductionData.poluchatelFio,
        organizationId: alimentDeductionData.organizationId,
        deductionId: alimentDeductionData.deductionId,
        mainZarplataId: alimentDeductionData.mainZarplataId,
        totalAmount: alimentDeductionData.totalAmount,
        dateStart: alimentDeductionData.dateStart
          ? formatDate(parseLocaleDate(alimentDeductionData.dateStart))
          : '',
        dateFinish: alimentDeductionData.dateFinish
          ? formatDate(parseLocaleDate(alimentDeductionData.dateFinish))
          : '',
        monthlyAmount: alimentDeductionData.monthlyAmount
      })
      if (alimentDeductionData.dateStart && alimentDeductionData.dateFinish) {
        const monthCount = getMonthsInPeriod(
          alimentDeductionData.dateStart,
          alimentDeductionData.dateFinish
        )
        setMonthCount(monthCount)
      } else {
        setMonthCount(0)
      }
    } else {
      setMonthCount(0)
      form.reset(defaultValues)
    }
  }, [alimentDeductionData])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('aliment')}</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormElement
                        label={t('card_number')}
                        grid="2:4"
                      >
                        <Input {...field} />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="poluchatelFio"
                    render={({ field }) => (
                      <FormElement
                        label={t('fio')}
                        grid="2:4"
                      >
                        <Input {...field} />
                      </FormElement>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateStart"
                    render={({ field }) => (
                      <FormElement
                        label={t('date_start')}
                        grid="2:4"
                      >
                        <JollyDatePicker
                          {...field}
                          onChange={(dateString) => {
                            field.onChange(dateString)

                            const dateFinish = form.getValues('dateFinish')
                            if (!dateFinish || !dateString) {
                              setMonthCount(0)
                              return
                            }

                            const monthCount = getMonthsInPeriod(dateString, dateFinish)
                            const totalAmount = form.getValues('totalAmount')

                            setMonthCount(monthCount)
                            form.setValue('monthlyAmount', totalAmount / monthCount)
                          }}
                        />
                      </FormElement>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateFinish"
                    render={({ field }) => (
                      <FormElement
                        label={t('date_finish')}
                        grid="2:4"
                      >
                        <JollyDatePicker
                          {...field}
                          onChange={(dateString) => {
                            field.onChange(dateString)

                            const dateStart = form.getValues('dateStart')
                            if (!dateStart || !dateString) {
                              setMonthCount(0)
                              return
                            }

                            const monthCount = getMonthsInPeriod(dateStart, dateString)
                            const totalAmount = form.getValues('totalAmount')

                            setMonthCount(monthCount)
                            console.log('monthlyAmount', totalAmount / monthCount, totalAmount)
                            form.setValue('monthlyAmount', totalAmount / monthCount)
                          }}
                        />
                      </FormElement>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyAmount"
                    render={({ field }) => (
                      <FormElement
                        label={t('monthly_amount')}
                        grid="2:4"
                      >
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values, event) => {
                            const monthlyAmount = values.floatValue ?? 0
                            field.onChange(monthlyAmount)

                            if (event.source === 'event') {
                              form.setValue('totalAmount', monthlyAmount * monthCount)
                            }
                          }}
                        />
                      </FormElement>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormElement
                        label={t('total_amount')}
                        grid="2:4"
                      >
                        <NumericInput
                          {...field}
                          onChange={undefined}
                          onValueChange={(values, event) => {
                            const totalAmount = values.floatValue ?? 0
                            field.onChange(totalAmount)

                            if (event.source === 'event') {
                              form.setValue('monthlyAmount', totalAmount / monthCount)
                            }
                          }}
                        />
                      </FormElement>
                    )}
                  />

                  <FormElement
                    label={t('organization')}
                    grid="2:4"
                  >
                    <SpravochnikInput
                      {...organSpravochnik}
                      getInputValue={(selected) => selected?.name ?? ''}
                    />
                  </FormElement>
                </div>

                <DialogFooter className="border-t pt-5 mt-5">
                  <Button
                    type="button"
                    onPress={handleSubmit}
                  >
                    {t('save')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
