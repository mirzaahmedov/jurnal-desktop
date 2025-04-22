import type { Pereotsenka } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { SpravochnikInput } from '@/common/features/spravochnik'
import { useSpravochnik } from '@/common/features/spravochnik'

import { createGroupSpravochnik } from '../group/service'
import { PereotsenkaFormSchema, PereotsenkaQueryKeys, defaultValues } from './config'
import { PereotsenkaService } from './service'

interface PereotsenkaDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: null | Pereotsenka
}
export const PereotsenkaDialog = ({ selected, isOpen, onOpenChange }: PereotsenkaDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PereotsenkaFormSchema)
  })

  const groupSpravochnik = useSpravochnik(
    createGroupSpravochnik({
      value: form.watch('group_jur7_id'),
      onChange(value) {
        form.setValue('group_jur7_id', value ?? 0)
        form.trigger('group_jur7_id')
      }
    })
  )

  const queryClient = useQueryClient()

  const { mutate: createPereotsenka, isPending: isCreating } = useMutation({
    mutationKey: [PereotsenkaQueryKeys.create],
    mutationFn: PereotsenkaService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [PereotsenkaQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updatePereotsenka, isPending: isUpdating } = useMutation({
    mutationKey: [PereotsenkaQueryKeys.update],
    mutationFn: PereotsenkaService.update,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [PereotsenkaQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  useEffect(() => {
    if (selected) {
      form.reset({
        ...selected,
        pereotsenka_foiz: Number(selected.pereotsenka_foiz)
      })
      return
    }
    form.reset(defaultValues)
  }, [form, selected])

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updatePereotsenka({
        ...values,
        id: selected.id
      })
      return
    }
    createPereotsenka(values)
  })

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.pereotsenka')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-6 py-4">
                <FormElement
                  label={t('group')}
                  grid="1:2"
                  message={form.formState.errors.group_jur7_id?.message}
                >
                  <SpravochnikInput
                    {...groupSpravochnik}
                    getInputValue={(selected) => selected?.name ?? ''}
                  />
                </FormElement>

                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      label={t('name')}
                      grid="1:2"
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />

                <FormField
                  name="pereotsenka_foiz"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      label={t('something_foiz', { something: t('iznos') })}
                      grid="1:2"
                    >
                      <NumericInput
                        {...field}
                        value={Number(field.value) === 0 ? '' : (field.value ?? '')}
                        onChange={undefined}
                        onValueChange={(values) => field.onChange(String(values.floatValue))}
                      />
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
      </DialogOverlay>
    </DialogTrigger>
  )
}
