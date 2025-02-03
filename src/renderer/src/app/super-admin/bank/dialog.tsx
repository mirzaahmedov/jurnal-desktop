import type { Bank } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { toast } from '@/common/hooks/use-toast'

import { BankFormSchema, bankQueryKeys, defaultValues } from './config'
import { bankService } from './service'

type BankDialogProps = {
  data?: Bank
  open: boolean
  onOpenChange: (open: boolean) => void
}
const BankDialog = ({ data, open, onOpenChange }: BankDialogProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(BankFormSchema)
  })

  const { mutate: createBank, isPending: isCreating } = useMutation({
    mutationKey: [bankQueryKeys.create],
    mutationFn: bankService.create,
    onSuccess() {
      toast({
        title: 'Банк успешно создан'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [bankQueryKeys.getAll]
      })
      onOpenChange(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать банк',
        description: error.message
      })
    }
  })
  const { mutate: updateBank, isPending: isUpdating } = useMutation({
    mutationKey: [bankQueryKeys.update],
    mutationFn: bankService.update,
    onSuccess() {
      toast({
        title: 'Банк успешно обновлен'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [bankQueryKeys.getAll]
      })
      onOpenChange(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить банк',
        description: error.message
      })
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (data) {
      updateBank({
        id: data.id,
        ...values
      })
      return
    }
    createBank(values)
  })

  useEffect(() => {
    if (open) {
      form.reset(data ?? defaultValues)
    }
  }, [form, open, data])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="titlecase">
            {data
              ? t('update-something', { something: t('bank') })
              : t('create-something', { something: t('bank') })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
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
    </Dialog>
  )
}

export { BankDialog }
