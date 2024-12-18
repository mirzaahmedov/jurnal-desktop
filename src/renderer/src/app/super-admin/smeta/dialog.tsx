import type { Smeta } from '@/common/models'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/common/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { smetaService } from './service'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { defaultValues, SmetaFormSchema, smetaQueryKeys } from './config'

type SmetaDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: Smeta | null
}
const SmetaDialog = (props: SmetaDialogProps) => {
  const { open, onChangeOpen, data } = props

  const { toast } = useToast()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(SmetaFormSchema)
  })

  const { mutate: createSmeta, isPending: isCreating } = useMutation({
    mutationFn: smetaService.create,
    onSuccess() {
      toast({
        title: 'Смета успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [smetaQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать смета',
        description: error.message
      })
    }
  })
  const { mutate: updateSmeta, isPending: isUpdating } = useMutation({
    mutationFn: smetaService.update,
    onSuccess() {
      toast({
        title: 'Смета успешно обновлена'
      })
      queryClient.invalidateQueries({
        queryKey: [smetaQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить смета',
        description: error.message
      })
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (data) {
      updateSmeta(Object.assign(payload, { id: data.id }))
    } else {
      createSmeta(payload)
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
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} Смета</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4 py-4">
              <FormField
                name="smeta_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Имя Сметы</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="smeta_number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Номер Сметы</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="group_number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Номер Группы</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="father_smeta_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Тип Сметы</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
              >
                {data ? 'Изменить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { SmetaDialog }
