import type { Bank } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormElement } from '@/common/components/form'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { capitalize } from '@/common/lib/string'

import { BankFormSchema, BankQueryKeys, defaultValues } from './config'
import { BankService } from './service'

interface BankDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected?: Bank
}
export const BankDialog = ({ selected, isOpen, onOpenChange }: BankDialogProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(BankFormSchema)
  })

  const { mutate: createBank, isPending: isCreating } = useMutation({
    mutationKey: [BankQueryKeys.create],
    mutationFn: BankService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [BankQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateBank, isPending: isUpdating } = useMutation({
    mutationKey: [BankQueryKeys.update],
    mutationFn: BankService.update,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [BankQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateBank({
        id: selected.id,
        ...values
      })
      return
    }
    createBank(values)
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
      return
    }
    form.reset(defaultValues)
  }, [form, selected])

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="titlecase">
              {selected ? t('bank') : capitalize(t('create-something', { something: t('bank') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="mfo"
                render={({ field }) => (
                  <FormElement
                    grid="1:2"
                    label={t('mfo')}
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormElement
                    grid="1:2"
                    label={t('name')}
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
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
