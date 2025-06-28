import type { Group } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { capitalize } from '@/common/lib/string'

import { GroupFormSchema, GroupQueryKeys, defaultValues } from './config'
import { GroupService } from './service'

export interface GroupDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: null | Group
}
export const GroupDialog = ({ selected, isOpen, onOpenChange }: GroupDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(GroupFormSchema)
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      onChange(_, smeta) {
        form.setValue('provodka_subschet', smeta?.smeta_number ?? '', { shouldValidate: true })
        form.setValue('smeta_id', smeta?.id ?? 0)
      }
    })
  )

  const queryClient = useQueryClient()

  const { mutate: createGroup, isPending: isCreating } = useMutation({
    mutationKey: [GroupQueryKeys.create],
    mutationFn: GroupService.create,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [GroupQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateGroup, isPending: isUpdating } = useMutation({
    mutationKey: [GroupQueryKeys.update],
    mutationFn: GroupService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [GroupQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
      return
    }
    form.reset(defaultValues)
  }, [form, selected])

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateGroup({
        ...values,
        id: selected.id
      })
      return
    }
    createGroup(values)
  })

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected ? t('group') : capitalize(t('create-something', { something: t('group') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-2.5 py-4">
                <FormField
                  name="group_number"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      label={t('group_number')}
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
                      label={t('name')}
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
                      label={t('schet')}
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
                      label={t('iznos_foiz')}
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
                  label={t('smeta')}
                  grid="1:2"
                  message={form.formState.errors.smeta_id?.message || ''}
                >
                  <SpravochnikInput
                    {...smetaSpravochnik}
                    getInputValue={() => form.watch('provodka_subschet')}
                  />
                </FormElement>

                <FormField
                  name="provodka_debet"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      label={t('debet')}
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
                      label={t('kredit')}
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
                      label={t('pod_group')}
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
                  isDisabled={isCreating || isUpdating}
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
