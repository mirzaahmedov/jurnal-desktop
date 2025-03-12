import type { DialogProps } from '@radix-ui/react-dialog'
import type { OstatokProduct } from '@renderer/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { NumericInput } from '@renderer/common/components'
import { FormElement } from '@renderer/common/components/form'
import { Button } from '@renderer/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import { Form, FormField } from '@renderer/common/components/ui/form'
import { capitalize } from '@renderer/common/lib/string'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { IznosFormSchema, defaultValues, iznosQueryKeys } from './config'
import { iznosService } from './service'

type EditIznosDialogProps = DialogProps & {
  selected: OstatokProduct | null
}
export const EditIznosDialog = ({ selected, ...props }: EditIznosDialogProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { mutate: updateIznos, isPending } = useMutation({
    mutationFn: iznosService.update,
    onSuccess() {
      toast.success('Износ успешно обновлен')
      queryClient.invalidateQueries({
        queryKey: [iznosQueryKeys.getAll]
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
