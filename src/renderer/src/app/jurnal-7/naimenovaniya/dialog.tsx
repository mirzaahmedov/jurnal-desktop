import type { Naimenovanie } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { createBudgetSpravochnik } from '@/app/super-admin/budjet'
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
import { useSpravochnik } from '@/common/features/spravochnik'
import { toast } from '@/common/hooks/use-toast'
import { extendObject } from '@/common/lib/utils'

import { createGroupSpravochnik } from '../../super-admin/group/service'
import { DenominationPayloadSchema, defaultValues, denominationQueryKeys } from './constants'
import { naimenovanieService } from './service'

export interface NaimenovanieDialogProps {
  data: null | Naimenovanie
  open: boolean
  onClose: () => void
}
export const NaimenovanieDialog = (props: NaimenovanieDialogProps) => {
  const { data, open, onClose } = props

  const form = useForm({
    defaultValues,
    resolver: zodResolver(DenominationPayloadSchema)
  })

  const budgetSpravochnik = useSpravochnik(
    createBudgetSpravochnik({
      value: form.watch('spravochnik_budjet_name_id'),
      onChange(value) {
        form.setValue('spravochnik_budjet_name_id', value)
        form.trigger('spravochnik_budjet_name_id')
      }
    })
  )
  const groupSpravochnik = useSpravochnik(
    createGroupSpravochnik({
      value: form.watch('group_jur7_id'),
      onChange(value) {
        form.setValue('group_jur7_id', value)
        form.trigger('group_jur7_id')
      }
    })
  )

  const queryClient = useQueryClient()
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [denominationQueryKeys.create],
    mutationFn: naimenovanieService.create,
    onSuccess() {
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [denominationQueryKeys.getAll]
      })
      onClose()
      toast({
        title: 'Наименование успешно создана'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при создании наименования',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [denominationQueryKeys.update],
    mutationFn: naimenovanieService.update,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [denominationQueryKeys.getAll]
      })
      onClose()
      toast({
        title: 'Наименование успешно изменена'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при изменении наименования',
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
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} наименование</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid gap-6 py-4">
              <FormElement
                label="Бюджет"
                grid="1:2"
                message={form.formState.errors.spravochnik_budjet_name_id?.message}
              >
                <Input
                  value={budgetSpravochnik.selected?.name ?? ''}
                  onDoubleClick={budgetSpravochnik.open}
                />
              </FormElement>

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Название"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                name="inventar_num"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Инвентарный номер"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                name="serial_num"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Серийный номер"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                name="edin"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    label="Единица измерения"
                    grid="1:2"
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormElement
                label="Группа"
                grid="1:2"
                message={form.formState.errors.group_jur7_id?.message}
              >
                <Input
                  value={groupSpravochnik.selected?.name ?? ''}
                  onDoubleClick={groupSpravochnik.open}
                />
              </FormElement>
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
