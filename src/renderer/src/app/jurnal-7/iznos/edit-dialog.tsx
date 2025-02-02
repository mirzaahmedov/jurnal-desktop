import type { Iznos } from '@renderer/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { DialogProps } from '@radix-ui/react-dialog'
import { DatePicker, NumericInput } from '@renderer/common/components'
import { FormElement } from '@renderer/common/components/form'
import { Button } from '@renderer/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import { Form, FormField } from '@renderer/common/components/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { IznosFormSchema, defaultValues, iznosQueryKeys } from './config'
import { iznosService } from './service'

type EditIznosDialogProps = DialogProps & {
  selected: Iznos | null
}
export const EditIznosDialog = ({ selected, ...props }: EditIznosDialogProps) => {
  const queryClient = useQueryClient()

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
      id: selected?.id,
      ...values
    })
  })

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }
    form.reset({
      iznos_start_date: selected.iznos_start_date,
      eski_iznos_summa: selected.eski_iznos_summa
    })
  }, [form, selected])

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать износ</DialogTitle>
        </DialogHeader>
        <div className="pt-5">
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="iznos_start_date"
                render={({ field }) => (
                  <FormElement
                    label="Дата начала износа"
                    direction="column"
                  >
                    <DatePicker {...field} />
                  </FormElement>
                )}
              />
              <FormField
                control={form.control}
                name="eski_iznos_summa"
                render={({ field }) => (
                  <FormElement
                    label="Старый сумма износ"
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
