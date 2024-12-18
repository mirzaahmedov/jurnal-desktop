import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { ResponsiblePayloadSchema, defaultValues, responsibleQueryKeys } from './constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/common/components/ui/button'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'
import type { Responsible } from '@/common/models'
import { createSubdivision7Spravochnik } from '../podrazdelenie/service'
import { extendObject } from '@/common/lib/utils'
import { responsibleService } from './service'
import { toast } from '@/common/hooks/use-toast'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSpravochnik } from '@/common/features/spravochnik'
import { zodResolver } from '@hookform/resolvers/zod'

export type ResponsibleDialogProps = {
  open: boolean
  onClose: () => void
  data: null | Responsible
}
const ResponsibleDialog = (props: ResponsibleDialogProps) => {
  const { open, onClose, data } = props

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(ResponsiblePayloadSchema)
  })

  const subdivision7Spravochnik = useSpravochnik(
    createSubdivision7Spravochnik({
      value: form.watch('spravochnik_podrazdelenie_jur7_id'),
      onChange(value) {
        form.setValue('spravochnik_podrazdelenie_jur7_id', value)
        form.trigger('spravochnik_podrazdelenie_jur7_id')
      }
    })
  )

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [responsibleQueryKeys.create],
    mutationFn: responsibleService.create,
    onSuccess() {
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [responsibleQueryKeys.getAll]
      })
      onClose()
      toast({
        title: 'Материально-ответственное лицо успешно создана'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при создании материально-ответственное лицо',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [responsibleQueryKeys.update],
    mutationFn: responsibleService.update,
    onSuccess() {
      onClose()
      queryClient.invalidateQueries({
        queryKey: [responsibleQueryKeys.getAll]
      })
      toast({
        title: 'Материально-ответственное лицо успешно изменена'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при изменении материально-ответственное лицо',
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
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} Материально-ответственное лицо</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="mt-5"
          >
            <div className="flex flex-col gap-6">
              <FormElement
                label="Подразделение"
                grid="1:2"
                message={form.formState.errors.spravochnik_podrazdelenie_jur7_id?.message}
              >
                <Input
                  value={subdivision7Spravochnik.selected?.name ?? ''}
                  onDoubleClick={subdivision7Spravochnik.open}
                />
              </FormElement>
              <FormField
                name="fio"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    grid="1:2"
                    label="ФИО"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />
            </div>
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

export default ResponsibleDialog
