import type { WarehousePodrazdelenie } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormElement } from '@/common/components/form'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

import {
  WarehousePodrazdelenieFormSchema,
  WarehousePodrazdelenieQueryKeys,
  defaultValues
} from './config'
import { WarehousePodrazdelenieService } from './service'

export interface WarehousePodrazdelenieDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: null | WarehousePodrazdelenie
}
export const WarehousePodrazdelenieDialog = ({
  selected,
  isOpen,
  onOpenChange
}: WarehousePodrazdelenieDialogProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(WarehousePodrazdelenieFormSchema)
  })

  const { mutate: createPodrazdelenie, isPending: isCreating } = useMutation({
    mutationKey: [WarehousePodrazdelenieQueryKeys.create],
    mutationFn: WarehousePodrazdelenieService.create,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [WarehousePodrazdelenieQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updatePodrazdelenie, isPending: isUpdating } = useMutation({
    mutationKey: [WarehousePodrazdelenieQueryKeys.update],
    mutationFn: WarehousePodrazdelenieService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [WarehousePodrazdelenieQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updatePodrazdelenie({
        ...values,
        id: selected.id
      })
      return
    }
    createPodrazdelenie(values)
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
      return
    }
    form.reset(defaultValues)
  }, [form, selected])

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selected
              ? t('podrazdelenie')
              : t('create-something', { something: t('podrazdelenie') })}
          </DialogTitle>
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
                  label={t('name')}
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
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </DialogTrigger>
  )
}
