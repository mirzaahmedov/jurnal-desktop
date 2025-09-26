import type { PayrollDeduction } from '@/common/models/payroll-deduction'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

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
import { Label } from '@/common/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { capitalize } from '@/common/lib/string'

import {
  OtherVedemostDeductionFormSchema,
  type OtherVedemostDeductionFormValues,
  deductionDefaultValues
} from '../config'

export enum DeductionType {
  Percentage = 'percentage',
  Summa = 'summa'
}

export interface OtherVedemostDeductionDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: PayrollDeduction | undefined
  onSubmit: (
    values: OtherVedemostDeductionFormValues,
    deductionType: DeductionType,
    form: UseFormReturn<OtherVedemostDeductionFormValues>
  ) => void
}
export const OtherVedemostDeductionDialog = ({
  selected,
  onSubmit,
  ...props
}: OtherVedemostDeductionDialogProps) => {
  const { t } = useTranslation()

  const [deductionType, setDeductionType] = useState(DeductionType.Percentage)

  const form = useForm({
    defaultValues: deductionDefaultValues,
    resolver: zodResolver(OtherVedemostDeductionFormSchema)
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
      setDeductionType(selected.percentage ? DeductionType.Percentage : DeductionType.Summa)
    } else {
      form.reset(deductionDefaultValues)
    }
  }, [selected])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values, deductionType, form)
  })

  const deductionSpravochnik = useSpravochnik(
    createDeductionSpravochnik({
      value: form.watch('deductionId'),
      onChange: (value) => {
        form.setValue('deductionId', value ?? 0, { shouldValidate: true })
      }
    })
  )

  console.log({ errors: form.formState.errors })

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

                {deductionType === DeductionType.Percentage ? (
                  <FormField
                    key={DeductionType.Percentage}
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
                          decimalScale={undefined}
                          allowNegative={false}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue ?? 0)
                          }}
                        />
                      </FormElement>
                    )}
                  />
                ) : (
                  <FormField
                    key={DeductionType.Summa}
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
                    value={deductionType}
                    onValueChange={(value) => setDeductionType(value as DeductionType)}
                    className="flex items-center justify-end gap-10 mb-5"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={DeductionType.Percentage}
                        id={DeductionType.Percentage}
                      />
                      <Label htmlFor={DeductionType.Percentage}>{t('foiz')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={DeductionType.Summa}
                        id={DeductionType.Summa}
                      />
                      <Label htmlFor={DeductionType.Summa}>{t('summa')}</Label>
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
