import type { Responsible } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

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
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { capitalize } from '@/common/lib/string'

import { createWarehousePodrazdelenieSpravochnik } from '../podrazdelenie/service'
import { ResponsibleFormSchema, ResponsibleQueryKeys, defaultValues } from './config'
import { ResponsibleService } from './service'

export interface ResponsibleDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: null | Responsible
}
export const ResponsibleDialog = ({ isOpen, onOpenChange, selected }: ResponsibleDialogProps) => {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(ResponsibleFormSchema)
  })

  const podrazdelenieSpravochnik = useSpravochnik(
    createWarehousePodrazdelenieSpravochnik({
      value: form.watch('spravochnik_podrazdelenie_jur7_id'),
      onChange(value) {
        form.setValue('spravochnik_podrazdelenie_jur7_id', value!)
        form.trigger('spravochnik_podrazdelenie_jur7_id')
      }
    })
  )

  const { mutate: createResponsible, isPending: isCreating } = useMutation({
    mutationKey: [ResponsibleQueryKeys.create],
    mutationFn: ResponsibleService.create,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [ResponsibleQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateResponsible, isPending: isUpdating } = useMutation({
    mutationKey: [ResponsibleQueryKeys.update],
    mutationFn: ResponsibleService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      onOpenChange?.(false)
      queryClient.invalidateQueries({
        queryKey: [ResponsibleQueryKeys.getAll]
      })
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateResponsible({
        ...values,
        id: selected.id
      })
      return
    }
    createResponsible(values)
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
      return
    }
    form.reset(defaultValues)
  }, [form, selected])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="titlecase">
            {selected
              ? t('responsible')
              : capitalize(t('create-something', { something: t('responsible') }))}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="mt-5"
          >
            <div className="flex flex-col gap-6">
              <FormElement
                label={t('podrazdelenie')}
                grid="1:2"
                message={form.formState.errors.spravochnik_podrazdelenie_jur7_id?.message}
              >
                <SpravochnikInput
                  {...podrazdelenieSpravochnik}
                  readOnly
                  getInputValue={(selected) => selected?.name || '-'}
                />
              </FormElement>
              <FormField
                name="fio"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    grid="1:2"
                    label={t('fio')}
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
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
