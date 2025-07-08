import type { Deduction } from '@/common/models/deduction'
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
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'

import { DeductionFormSchema, defaultValues } from './config'
import { DeductionsService } from './service'

export interface DeductionsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedPayment?: Deduction
}
export const DeductionsDialog = ({ selectedPayment, ...props }: DeductionsDialogProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues,
    resolver: zodResolver(DeductionFormSchema)
  })

  const { mutate: createDeduction, isPending: isCreating } = useMutation({
    mutationFn: DeductionsService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [DeductionsService.QueryKeys.GetAll]
      })
      form.reset(defaultValues)
      props.onOpenChange?.(false)
    },
    onError: () => {
      toast.success(t('create_failed'))
    }
  })
  const { mutate: updateDeduction, isPending: isUpdating } = useMutation({
    mutationFn: DeductionsService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [DeductionsService.QueryKeys.GetAll]
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
      updateDeduction(values)
    } else {
      createDeduction(values)
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
                    name="shortName"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('name_short')}
                      >
                        <Textarea
                          ref={field.ref}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormElement>
                    )}
                  />

                  <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] items-end gap-5">
                    <FormField
                      control={form.control}
                      name="debitAccount"
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

                  <DialogFooter className="col-span-full">
                    <Button
                      type="submit"
                      isPending={isCreating || isUpdating}
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
