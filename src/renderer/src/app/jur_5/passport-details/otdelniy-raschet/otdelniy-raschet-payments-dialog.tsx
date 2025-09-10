import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { z } from 'zod'

import { createDeductionSpravochnik } from '@/app/jur_5/payment-types/deductions/service'
import { createPaymentSpravochnik } from '@/app/jur_5/payment-types/payments/service'
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
import { Form, FormField } from '@/common/components/ui/form'
import { Label } from '@/common/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import { OtdelniyRaschetService } from './service'

export enum PaymentType {
  Percentage = 'percentage',
  Summa = 'summa'
}

export interface OtdelniyRaschetPaymentDialogProps extends Omit<DialogTriggerProps, 'children'> {
  isDeduction?: boolean
  otdelniyRaschetMainId?: number | null
}
export const OtdelniyRaschetPaymentDialog = ({
  isDeduction = false,
  otdelniyRaschetMainId,
  ...props
}: OtdelniyRaschetPaymentDialogProps) => {
  const { t } = useTranslation()

  const [paymentType, setPaymentType] = useState(PaymentType.Percentage)

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues
  })

  const closeDialog = () => props.onOpenChange?.(false)

  const createPaymentMutation = useMutation({
    mutationFn: OtdelniyRaschetService.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OtdelniyRaschetService.QueryKeys.GetById, otdelniyRaschetMainId]
      })
      form.reset(defaultValues)
      toast.success(t('create_success'))
      closeDialog()
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const createDeductionMutation = useMutation({
    mutationFn: OtdelniyRaschetService.createDeduction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OtdelniyRaschetService.QueryKeys.GetById, otdelniyRaschetMainId]
      })
      form.reset(defaultValues)
      toast.success(t('create_success'))
      closeDialog()
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })

  const paymentSpravochnik = useSpravochnik(
    createPaymentSpravochnik({
      value: form.watch('paymentId'),
      onChange: (value) => {
        form.setValue('paymentId', value ?? 0, { shouldValidate: true })
      }
    })
  )
  const deductionSpravochnik = useSpravochnik(
    createDeductionSpravochnik({
      value: form.watch('deductionId'),
      onChange: (value) => {
        form.setValue('deductionId', value ?? 0, { shouldValidate: true })
      }
    })
  )

  const handleSubmit = form.handleSubmit((values) => {
    if (isDeduction) {
      createDeductionMutation.mutate({
        deductionId: values.deductionId,
        percentage: paymentType === PaymentType.Percentage ? values.percentage : 0,
        summa: paymentType === PaymentType.Summa ? values.summa : 0,
        otdelniyRaschetMainId: otdelniyRaschetMainId ?? 0,
        paymentId: null
      })
    } else {
      createPaymentMutation.mutate({
        paymentId: values.paymentId,
        percentage: paymentType === PaymentType.Percentage ? values.percentage : 0,
        summa: paymentType === PaymentType.Summa ? values.summa : 0,
        otdelniyRaschetMainId: otdelniyRaschetMainId ?? 0,
        deductionId: null
      })
    }
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isDeduction ? t('deduction') : t('payment')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {isDeduction ? (
                <FormField
                  control={form.control}
                  name="deductionId"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('deduction')}
                    >
                      <SpravochnikInput
                        {...deductionSpravochnik}
                        inputRef={field.ref}
                        getInputValue={(selected) => (selected ? selected.name : '')}
                      />
                    </FormElement>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="paymentId"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('payment')}
                    >
                      <SpravochnikInput
                        {...paymentSpravochnik}
                        inputRef={field.ref}
                        getInputValue={(selected) => (selected ? selected.name : '')}
                      />
                    </FormElement>
                  )}
                />
              )}

              {paymentType === PaymentType.Percentage ? (
                <FormField
                  key={PaymentType.Percentage}
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('foiz')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        allowNegative={false}
                        decimalScale={undefined}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? 0)
                        }}
                      />
                    </FormElement>
                  )}
                />
              ) : (
                <FormField
                  key={PaymentType.Summa}
                  control={form.control}
                  name="summa"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('summa')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                        onBlur={field.onBlur}
                      />
                    </FormElement>
                  )}
                />
              )}

              <div>
                <RadioGroup
                  value={paymentType}
                  onValueChange={(value) => setPaymentType(value as PaymentType)}
                  className="flex items-center justify-end gap-10 mb-5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={PaymentType.Percentage}
                      id={PaymentType.Percentage}
                    />
                    <Label htmlFor={PaymentType.Percentage}>{t('foiz')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={PaymentType.Summa}
                      id={PaymentType.Summa}
                    />
                    <Label htmlFor={PaymentType.Summa}>{t('summa')}</Label>
                  </div>
                </RadioGroup>
              </div>

              <DialogFooter>
                <Button type="submit">{t('save')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const OtdelniyRaschetPaymentFormSchema = z.object({
  otdelniyRaschetMainId: z.number().nullable(),
  percentage: z.number().min(0).max(100),
  summa: z.number().min(0),
  paymentId: z.number().min(1).nullable(),
  deductionId: z.number().min(1).nullable()
})
export type OtdelniyRaschetPaymentFormValues = z.infer<typeof OtdelniyRaschetPaymentFormSchema>

const defaultValues = {
  otdelniyRaschetMainId: 0,
  percentage: 0,
  summa: 0,
  paymentId: 0,
  deductionId: 0
}
