import type { PayrollPayment } from '@/common/models/payroll-payment'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { Checkbox } from '@/common/components/jolly/checkbox'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { capitalize } from '@/common/lib/string'

import { PrivilegeFormSchema, type PrivilegeFormValues, defaultValues } from './config'

export interface PrivilegesFormProps extends Omit<DialogTriggerProps, 'children'> {
  selected: PayrollPayment | undefined
  onSubmit: (values: PrivilegeFormValues, form: UseFormReturn<PrivilegeFormValues>) => void
}
export const PrivilegesForm = ({ selected, onSubmit, ...props }: PrivilegesFormProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PrivilegeFormSchema)
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

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('privilege')
                : capitalize(t('create-something', { something: t('privilege') }))}
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
                  name="name"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('name')}
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('opisanie')}
                    >
                      <Textarea {...field} />
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
                        onBlur={field.onBlur}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRaschet"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('has_gotten_payroll')}
                    >
                      <Checkbox
                        ref={field.ref}
                        isSelected={field.value}
                        onChange={(isSelected) => field.onChange(isSelected)}
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
