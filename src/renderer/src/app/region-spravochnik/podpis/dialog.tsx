import type { Podpis } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { NumericInput, SelectField } from '@/common/components'
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

import {
  PodpisPayloadSchema,
  defaultValues,
  podpisDoljnostOptions,
  podpisQueryKeys,
  podpisTypeDocumentOptions
} from './constants'
import { podpisService } from './service'

type PodpisDialogProps = {
  data?: Podpis
  open: boolean
  onOpenChange: (open: boolean) => void
}
const PodpisDialog = ({ data, open, onOpenChange }: PodpisDialogProps) => {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(PodpisPayloadSchema)
  })

  const { mutate: createPodpis, isPending: isCreating } = useMutation({
    mutationKey: [podpisQueryKeys.create],
    mutationFn: podpisService.create,
    onSuccess() {
      toast({
        title: 'Подпись успешно создан'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [podpisQueryKeys.getAll]
      })
      onOpenChange(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать подпись',
        description: error.message
      })
    }
  })
  const { mutate: updatePodpis, isPending: isUpdating } = useMutation({
    mutationKey: [podpisQueryKeys.update],
    mutationFn: podpisService.update,
    onSuccess() {
      toast({
        title: 'Подпись успешно обновлен'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [podpisQueryKeys.getAll]
      })
      onOpenChange(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить подпись',
        description: error.message
      })
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (data) {
      updatePodpis({
        id: data.id,
        ...values
      })
      return
    }
    createPodpis(values)
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
          <DialogTitle>Подпись</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="doljnost_name"
              render={({ field }) => (
                <FormElement
                  grid="1:2"
                  label="Должность"
                >
                  <SelectField
                    {...field}
                    options={podpisDoljnostOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.key}
                    placeholder="Выберите должность"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="fio_name"
              render={({ field }) => (
                <FormElement
                  grid="1:2"
                  label="ФИО"
                >
                  <Input {...field} />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="type_document"
              render={({ field }) => (
                <FormElement
                  grid="1:2"
                  label="Тип документа"
                >
                  <SelectField
                    {...field}
                    options={podpisTypeDocumentOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.key}
                    placeholder="Выберите тип документа"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="numeric_poryadok"
              render={({ field }) => (
                <FormElement
                  grid="1:2"
                  label="Номер порядка"
                >
                  <NumericInput
                    {...field}
                    allowedDecimalSeparators={[]}
                    thousandSeparator=""
                    className="text-left"
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? 0)
                    }}
                  />
                </FormElement>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
              >
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { PodpisDialog }
