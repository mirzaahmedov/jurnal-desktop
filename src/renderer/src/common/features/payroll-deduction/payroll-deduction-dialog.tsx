import type { PayrollDeduction } from '@/common/models/payroll-deduction'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { createDeductionSpravochnik } from '@/app/jur_5/payment-types/deductions/service'
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
import {
  PayrollDeductionFormSchema,
  type PayrollDeductionFormValues,
  defaultValues
} from './config'

export interface PayrollDeductionDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: PayrollDeduction | undefined
  onSubmit: (
    values: PayrollDeductionFormValues,
    form: UseFormReturn<PayrollDeductionFormValues>
  ) => void
}
export const PayrollDeductionDialog = ({
  selected,
  onSubmit,
  ...props
}: PayrollDeductionDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PayrollDeductionFormSchema)
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

  const deductionSpravochnik = useSpravochnik(
    createDeductionSpravochnik({
      value: form.watch('deductionId'),
      onChange: (value) => {
        form.setValue('deductionId', value ?? 0)
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
                        onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
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
