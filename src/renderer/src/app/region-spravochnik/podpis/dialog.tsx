import type { Podpis } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useMemo } from 'react'

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
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { FieldGroup } from '@/common/components/jolly/field'
import {
  NumberField,
  NumberFieldInput,
  NumberFieldSteppers
} from '@/common/components/jolly/number-field'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Button } from '@/common/components/ui/button'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { capitalize } from '@/common/lib/string'

import {
  PodpisPayloadSchema,
  PodpisQueryKeys,
  defaultValues,
  getPodpisDoljnostOptions,
  getPodpisTypeDocumentOptions
} from './config'
import { PodpisService } from './service'

interface PodpisDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected?: Podpis
}
export const PodpisDialog = ({ selected, isOpen, onOpenChange }: PodpisDialogProps) => {
  const { t } = useTranslation(['app', 'podpis'])

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(PodpisPayloadSchema)
  })

  const { mutate: createPodpis, isPending: isCreating } = useMutation({
    mutationKey: [PodpisQueryKeys.create],
    mutationFn: PodpisService.create,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodpisQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updatePodpis, isPending: isUpdating } = useMutation({
    mutationKey: [PodpisQueryKeys.update],
    mutationFn: PodpisService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodpisQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updatePodpis({
        id: selected.id,
        ...values
      })
      return
    }
    createPodpis(values)
  })

  useEffect(() => {
    if (isOpen) {
      form.reset(selected ?? defaultValues)
    }
  }, [form, isOpen, selected])

  const podpisTypeOptions = useMemo(() => getPodpisTypeDocumentOptions(t), [t])
  const podpisDoljnostOptions = useMemo(() => getPodpisDoljnostOptions(t), [t])

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('pages.podpis')
                : capitalize(t('create-something', { something: t('podpis') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="doljnost_name"
                render={({ field }) => (
                  <FormElement
                    grid="1:2"
                    label={t('doljnost')}
                  >
                    <JollySelect
                      items={podpisDoljnostOptions}
                      placeholder={t('doljnost')}
                      selectedKey={field.value}
                      onSelectionChange={(value) => field.onChange(value)}
                    >
                      {(item) => <SelectItem id={item.key}>{item.name}</SelectItem>}
                    </JollySelect>
                  </FormElement>
                )}
              />
              <FormField
                control={form.control}
                name="fio_name"
                render={({ field }) => (
                  <FormElement
                    grid="1:2"
                    label={t('fio')}
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />
              <FormField
                control={form.control}
                name="type_document"
                render={({ field }) => (
                  <FormElement
                    grid="1:2"
                    label={t('type-document')}
                  >
                    <JollySelect
                      items={podpisTypeOptions}
                      placeholder={t('type-document')}
                      onSelectionChange={(value) => field.onChange(value)}
                      selectedKey={field.value}
                    >
                      {(item) => <SelectItem id={item.key}>{item.name}</SelectItem>}
                    </JollySelect>
                  </FormElement>
                )}
              />
              <FormField
                control={form.control}
                name="numeric_poryadok"
                render={({ field }) => (
                  <FormElement
                    grid="1:2"
                    label={t('numeric-order')}
                  >
                    <NumberField
                      value={field.value}
                      onChange={field.onChange}
                      minValue={1}
                      formatOptions={{
                        maximumFractionDigits: 0
                      }}
                    >
                      <FieldGroup>
                        <NumberFieldInput />
                        <NumberFieldSteppers />
                      </FieldGroup>
                    </NumberField>
                  </FormElement>
                )}
              />
              <DialogFooter>
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
