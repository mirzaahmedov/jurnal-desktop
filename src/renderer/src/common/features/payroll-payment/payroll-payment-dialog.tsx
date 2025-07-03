import type { PayrollPayment } from '@/common/models/payroll-payment'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

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
import { capitalize } from '@/common/lib/string'

import { SpravochnikInput, useSpravochnik } from '../spravochnik'
import { PayrollPaymentFormSchema, type PayrollPaymentFormValues, defaultValues } from './config'

export interface PayrollPaymentDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: PayrollPayment | undefined
  doljnostOklad: number
  onSubmit: (
    values: PayrollPaymentFormValues,
    form: UseFormReturn<PayrollPaymentFormValues>
  ) => void
}
export const PayrollPaymentDialog = ({
  selected,
  doljnostOklad,
  onSubmit,
  ...props
}: PayrollPaymentDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PayrollPaymentFormSchema)
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
    } else {
      form.reset(defaultValues)
    }
  }, [selected])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values, form)
  })

  const paymentSpravochnik = useSpravochnik(
    createPaymentSpravochnik({
      value: form.watch('paymentId'),
      onChange: (value) => {
        form.setValue('paymentId', value ?? 0)
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
                <FormField
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
                          const percentageValue = values.floatValue ?? 0
                          field.onChange(percentageValue)
                          form.setValue('summa', (doljnostOklad * percentageValue) / 100)
                        }}
                      />
                    </FormElement>
                  )}
                />
                <FormField
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
                      />
                    </FormElement>
                  )}
                />
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
