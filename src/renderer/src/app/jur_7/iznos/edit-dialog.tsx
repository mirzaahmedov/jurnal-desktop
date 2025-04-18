import type { SaldoProduct } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { capitalize } from '@/common/lib/string'

import { IznosFormSchema, IznosQueryKeys, defaultValues } from './config'
import { iznosService } from './service'

type EditIznosDialogProps = DialogProps & {
  selected: SaldoProduct | null
}
export const EditIznosDialog = ({ selected, ...props }: EditIznosDialogProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { mutate: updateIznos, isPending } = useMutation({
    mutationFn: iznosService.update,
    onSuccess() {
      toast.success('Износ успешно обновлен')
      queryClient.invalidateQueries({
        queryKey: [IznosQueryKeys.getAll]
      })
      props.onOpenChange?.(false)
    },
    onError(error) {
      console.error(error)
      toast.error('Ошибка при обновлении износа')
    }
  })

  const form = useForm({
    defaultValues,
    resolver: zodResolver(IznosFormSchema)
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!selected) return
    updateIznos({
      id: selected.id,
      ...values
    })
  })

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }
    form.reset({
      iznos_summa: selected?.to?.iznos_summa ?? defaultValues.iznos_summa
    })
  }, [form, selected])

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{capitalize(t('edit-resource', { resource: t('iznos') }))}</DialogTitle>
        </DialogHeader>
        <div className="pt-5">
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="iznos_summa"
                render={({ field }) => (
                  <FormElement
                    label={t('iznos_summa_old')}
                    direction="column"
                  >
                    <NumericInput
                      {...field}
                      value={field.value || ''}
                      onChange={undefined}
                      onValueChange={(values) => field.onChange(values.floatValue)}
                    />
                  </FormElement>
                )}
              />
              <Button
                disabled={isPending}
                type="submit"
              >
                Сохранить
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
