import type { Unit } from '@/common/models'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/common/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UnitForm, UnitFormSchema, unitService } from './service'
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
import { unitQueryKeys } from './constants'

type UnitDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: Unit | null
}
const UnitDialog = (props: UnitDialogProps) => {
  const { open, onChangeOpen, data } = props

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const form = useForm<UnitForm>({
    defaultValues,
    resolver: zodResolver(UnitFormSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [unitQueryKeys.create],
    mutationFn: unitService.create,
    onSuccess() {
      toast({
        title: 'Роль успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [unitQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать роль',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [unitQueryKeys.update],
    mutationFn: unitService.update,
    onSuccess() {
      toast({
        title: 'Роль успешно обновлена'
      })
      queryClient.invalidateQueries({
        queryKey: [unitQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить роль',
        description: error.message
      })
    }
  })

  const onSubmit = (payload: UnitForm) => {
    if (data) {
      update(Object.assign(payload, { id: data.id }))
    } else {
      create(payload)
    }
  }

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
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} роль</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Название</FormLabel>
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

const defaultValues = {
  name: ''
} satisfies UnitForm

export { UnitDialog }
