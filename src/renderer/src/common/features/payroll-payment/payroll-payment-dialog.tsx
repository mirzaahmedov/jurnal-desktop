import type { PayrollPayment } from '@/common/models/payroll-payment'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
import { capitalize } from '@/common/lib/string'

import { SpravochnikInput, useSpravochnik } from '../spravochnik'
import { PayrollPaymentFormSchema, type PayrollPaymentFormValues, defaultValues } from './config'

export enum PaymentType {
  Percentage = 'percentage',
  Summa = 'summa'
}

export interface PayrollPaymentDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: PayrollPayment | undefined
  onSubmit: (
    values: PayrollPaymentFormValues,
    paymentType: PaymentType,
    form: UseFormReturn<PayrollPaymentFormValues>
  ) => void
}
export const PayrollPaymentDialog = ({
  selected,
  onSubmit,
  ...props
}: PayrollPaymentDialogProps) => {
  const { t } = useTranslation()

  const [paymentType, setPaymentType] = useState(PaymentType.Percentage)

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PayrollPaymentFormSchema)
  })

  useEffect(() => {
    if (selected) {
      setPaymentType(selected.percentage ? PaymentType.Percentage : PaymentType.Summa)
      form.reset(selected)
    } else {
      form.reset(defaultValues)
    }
  }, [selected])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values, paymentType, form)
  })

  const paymentSpravochnik = useSpravochnik(
    createPaymentSpravochnik({
      value: form.watch('paymentId'),
      onChange: (value) => {
        form.setValue('paymentId', value ?? 0, { shouldValidate: true })
      }
    })
  )

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('shtatka')
                : capitalize(t('create-something', { something: t('shtatka') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-4 mt-10"
            >
              <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-5">
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
                          isAllowed={(value) => {
                            const floatValue = value.floatValue ?? 0
                            return floatValue >= 0 && floatValue <= 100
                          }}
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
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleSubmit}
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
