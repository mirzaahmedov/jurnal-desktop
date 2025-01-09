import type { Jur7Podrazdelenie } from '@/common/models'

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
import { toast } from '@/common/hooks/use-toast'
import { extendObject } from '@/common/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Subdivision7PayloadSchema, defaultValues, subdivision7QueryKeys } from './constants'
import { subdivision7Service } from './service'
import { Input } from '@/common/components/ui/input'

export type Subdivision7DialogProps = {
  open: boolean
  onClose: () => void
  data: null | Jur7Podrazdelenie
}
const Subdivision7Dialog = (props: Subdivision7DialogProps) => {
  const { open, onClose, data } = props

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(Subdivision7PayloadSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [subdivision7QueryKeys.create],
    mutationFn: subdivision7Service.create,
    onSuccess() {
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [subdivision7QueryKeys.getAll]
      })
      onClose()
      toast({
        title: 'Подразделениe успешно создана'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при создании подразделения',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [subdivision7QueryKeys.update],
    mutationFn: subdivision7Service.update,
    onSuccess() {
      onClose()
      queryClient.invalidateQueries({
        queryKey: [subdivision7QueryKeys.getAll]
      })
      toast({
        title: 'Подразделениe успешно изменена'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при изменении подразделения',
        description: error.message
      })
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (data) {
      update(
        extendObject(
          {
            id: data.id
          },
          payload
        )
      )
      return
    }
    create(payload)
  })

  useEffect(() => {
    if (data) {
      form.reset(data)
      return
    }
    form.reset(defaultValues)
  }, [form, data])
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} подразделение</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="mt-5"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label="Название"
                >
                  <Input {...field} />
                </FormElement>
              )}
            />
            <DialogFooter className="mt-5">
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

export default Subdivision7Dialog
