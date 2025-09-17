import type { Payment } from '@/common/models/payments'
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
import { Checkbox } from '@/common/components/ui/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'

import { PaymentFormSchema, defaultValues } from './config'
import { PaymentsService } from './service'

export interface PaymentsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedPayment?: Payment
}
export const PaymentsDialog = ({ selectedPayment, ...props }: PaymentsDialogProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PaymentFormSchema)
  })

  const { mutate: createPayment, isPending: isCreatingPayment } = useMutation({
    mutationFn: PaymentsService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [PaymentsService.QueryKeys.GetAll]
      })
      form.reset(defaultValues)
      props.onOpenChange?.(false)
    },
    onError: () => {
      toast.success(t('create_failed'))
    }
  })
  const { mutate: updatePayment, isPending: isUpdatingPayment } = useMutation({
    mutationFn: PaymentsService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [PaymentsService.QueryKeys.GetAll]
      })
      form.reset(defaultValues)
      props.onOpenChange?.(false)
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (selectedPayment) {
      updatePayment(values)
    } else {
      createPayment(values)
    }
  })

  useEffect(() => {
    if (selectedPayment) {
      form.reset(selectedPayment)
    } else {
      form.reset(defaultValues)
    }
  }, [selectedPayment])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPayment
                ? t('pages.payments')
                : t('create-something', { something: t('pages.payments') })}
            </DialogTitle>
          </DialogHeader>

          <div>
            <Form {...form}>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormElement
                        label={t('payment_code')}
                        direction="column"
                      >
                        <NumericInput
                          readOnly={!!selectedPayment}
                          ref={field.ref}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
                        />
                      </FormElement>
                    )}
                  />
                  <div></div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('name')}
                      >
                        <Textarea
                          ref={field.ref}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nameUz"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('name_uz')}
                      >
                        <Textarea
                          ref={field.ref}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormElement>
                    )}
                  />

                  <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(50px,100px))] gap-5 divide-x bg-gray-100 rounded-lg">
                    {(
                      [
                        { name: 'isINPSTaxable', label: t('inps_taxable') },
                        {
                          name: 'isUnionDeductible',
                          label: t('labor_union_fee')
                        },
                        { name: 'isAlimonyDeductible', label: t('alimony_deductable') },
                        { name: 'isIncomeTaxDeductible', label: t('income_tax') },
                        { name: 'isUSTDeductible', label: t('esp_tax') }
                      ] as const
                    ).map(({ name, label }) => (
                      <div
                        key={name}
                        className="h-full p-5"
                      >
                        <FormField
                          control={form.control}
                          name={name}
                          render={({ field }) => (
                            <FormElement
                              direction="column"
                              label={label}
                              divProps={{ className: 'h-full justify-between gap-5' }}
                              innerProps={{ className: 'flex-none' }}
                              labelProps={{ className: 'leading-normal' }}
                              className="h-full flex flex-col leading-"
                            >
                              <Checkbox
                                ref={field.ref}
                                checked={field.value}
                                onCheckedChange={(checked) => field.onChange(checked)}
                              />
                            </FormElement>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] items-end gap-5">
                    <FormField
                      control={form.control}
                      name="expenseAccount"
                      render={({ field }) => (
                        <FormElement
                          direction="column"
                          label={t('expense_schet')}
                        >
                          <Input
                            ref={field.ref}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormElement>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="creditAccount"
                      render={({ field }) => (
                        <FormElement
                          direction="column"
                          label={t('credit_schet')}
                        >
                          <Input
                            ref={field.ref}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormElement>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subAccount"
                      render={({ field }) => (
                        <FormElement
                          direction="column"
                          label={t('subschet')}
                        >
                          <Input
                            ref={field.ref}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormElement>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="sourceFund"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('main_fund')}
                      >
                        <Input
                          ref={field.ref}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormElement>
                    )}
                  />

                  {/* <div className="col-span-full">
                    <FormField
                      control={form.control}
                      name="calculationFormula"
                      render={({ field }) => (
                        <FormElement
                          direction="column"
                          label={t('calc_formula')}
                        >
                          <Textarea
                            ref={field.ref}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            rows={5}
                          />
                        </FormElement>
                      )}
                    />
                  </div> */}

                  <div className="col-span-full flex justify-end">
                    <FormField
                      control={form.control}
                      name="isOklad"
                      render={({ field }) => (
                        <FormElement label={t('position_salary_only')}>
                          <Checkbox
                            ref={field.ref}
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked)}
                          />
                        </FormElement>
                      )}
                    />
                  </div>

                  <DialogFooter className="col-span-full">
                    <Button
                      type="submit"
                      isPending={isCreatingPayment || isUpdatingPayment}
                    >
                      {t('save')}
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
