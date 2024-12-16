import type { TypeOperatsii } from '@/common/models'
import type { OperationTypePayloadType } from './service'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/common/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { operationTypeService, OperationTypePayloadSchema } from './service'
import { Button } from '@/common/components/ui/button'
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { operationTypeQueryKeys } from './constants'
import { FormDialog } from '@/common/components/dialog'

type OperationTypeDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: TypeOperatsii | null
}
const OperationTypeDialog = (props: OperationTypeDialogProps) => {
  const { open, onChangeOpen, data } = props

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const form = useForm<OperationTypePayloadType>({
    defaultValues,
    resolver: zodResolver(OperationTypePayloadSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [operationTypeQueryKeys.create],
    mutationFn: operationTypeService.create,
    onSuccess() {
      toast({
        title: 'тип операции успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [operationTypeQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать тип операции',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [operationTypeQueryKeys.update],
    mutationFn: operationTypeService.update,
    onSuccess() {
      toast({
        title: 'тип операции успешно обновлена'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [operationTypeQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить тип операции',
        description: error.message
      })
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (data) {
      update(Object.assign(payload, { id: data.id }))
    } else {
      create(payload)
    }
  })

  useEffect(() => {
    if (!data) {
      form.reset(defaultValues)
      return
    }

    form.reset(data)
  }, [form, data])

  return (
    <FormDialog
      open={open}
      onChangeOpen={onChangeOpen}
      name={`${data ? 'Изменить' : 'Добавить'} тип операции`}
      form={form}
      onSubmit={onSubmit}
      footer={
        <Button type="submit" disabled={isCreating || isUpdating}>
          {data ? 'Изменить' : 'Добавить'}
        </Button>
      }
    >
      <div className="grid gap-4 py-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                <FormLabel className="text-right col-span-2">Название</FormLabel>
                <FormControl>
                  <Input className="col-span-4" {...field} />
                </FormControl>
                <FormMessage className="text-end col-span-6" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          name="rayon"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                <FormLabel className="text-right col-span-2">Район</FormLabel>
                <FormControl>
                  <Input className="col-span-4" {...field} />
                </FormControl>
                <FormMessage className="text-end col-span-6" />
              </div>
            </FormItem>
          )}
        />
      </div>
    </FormDialog>
  )
}

const defaultValues = {
  name: '',
  rayon: ''
} satisfies OperationTypePayloadType

export default OperationTypeDialog
