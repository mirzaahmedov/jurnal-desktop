import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { SpravochnikInput } from '@/common/components'
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
import { createSpravochnikKeyBindings, useSpravochnik } from '@/common/features/spravochnik'
import { toast } from '@/common/hooks/use-toast'
import { extendObject } from '@/common/lib/utils'
import { Group } from '@/common/models'

import { GroupPayloadSchema, defaultValues, groupQueryKeys } from './constants'
import { groupService } from './service'

type GroupDialogProps = {
  data: null | Group
  open: boolean
  onClose: () => void
}
const GroupDialog = (props: GroupDialogProps) => {
  const { data, open, onClose } = props

  const form = useForm({
    defaultValues,
    resolver: zodResolver(GroupPayloadSchema)
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      onChange(_, smeta) {
        if (!smeta) {
          toast({
            title: 'Смета не найдена',
            variant: 'destructive'
          })
          return
        }
        form.setValue('provodka_subschet', smeta?.smeta_number)
        form.setValue('smeta_id', smeta?.id)
        form.trigger('provodka_subschet')
      }
    })
  )

  const queryClient = useQueryClient()
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [groupQueryKeys.create],
    mutationFn: groupService.create,
    onSuccess() {
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [groupQueryKeys.getAll]
      })
      onClose()
      toast({
        title: 'Группа успешно создана'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при создании группы',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [groupQueryKeys.update],
    mutationFn: groupService.update,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [groupQueryKeys.getAll]
      })
      onClose()
      toast({
        title: 'Группа успешно изменена'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при изменении группы',
        description: error.message
      })
    }
  })

  useEffect(() => {
    if (data) {
      form.reset(data)
      return
    }
    form.reset(defaultValues)
  }, [form, data])

  const onSubmit = form.handleSubmit((payload) => {
    if (data) {
      update(
        extendObject(payload, {
          id: data.id
        })
      )
      return
    }
    create(payload)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} группу</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid gap-6 py-4">
              <FormField
                name="group_number"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Номер группы"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Наименования"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                name="schet"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Счет"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                name="iznos_foiz"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Износ (%)"
                    grid="1:2"
                  >
                    <Input
                      type="number"
                      {...field}
                    />
                  </FormElement>
                )}
              />

              <FormElement
                label="Смета"
                grid="1:2"
                message={form.formState.errors.smeta_id?.message || ''}
              >
                <SpravochnikInput
                  readOnly
                  value={form.watch('provodka_subschet')}
                  onDoubleClick={smetaSpravochnik.open}
                  onClear={smetaSpravochnik.clear}
                  onKeyDown={createSpravochnikKeyBindings({
                    open: smetaSpravochnik.open,
                    clear: smetaSpravochnik.clear
                  })}
                />
              </FormElement>

              <FormField
                name="provodka_debet"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Дебет"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                name="provodka_kredit"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Кредит"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                name="pod_group"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Подгруппа"
                    grid="1:2"
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

export default GroupDialog
