import type { Jur7Podrazdelenie } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
import { extendObject } from '@/common/lib/utils'

import { Subdivision7PayloadSchema, defaultValues, podrazdelenieQueryKeys } from './constants'
import { podrazdelenieService } from './service'

export interface Podrazdelenie7DialogProps {
  open: boolean
  onClose: () => void
  selected: null | Jur7Podrazdelenie
}
export const Podrazdelenie7Dialog = (props: Podrazdelenie7DialogProps) => {
  const { open, onClose, selected } = props

  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(Subdivision7PayloadSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [podrazdelenieQueryKeys.create],
    mutationFn: podrazdelenieService.create,
    onSuccess() {
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [podrazdelenieQueryKeys.getAll]
      })
      onClose()
      toast.success('Подразделениe успешно создана')
    },
    onError(error) {
      console.error(error)
      toast.error('Ошибка при создании подразделения: ' + error.message)
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [podrazdelenieQueryKeys.update],
    mutationFn: podrazdelenieService.update,
    onSuccess() {
      onClose()
      queryClient.invalidateQueries({
        queryKey: [podrazdelenieQueryKeys.getAll]
      })
      toast.success('Подразделениe успешно изменена')
    },
    onError(error) {
      console.error(error)
      toast.error('Ошибка при изменении подразделения' + error.message)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (selected) {
      update(
        extendObject(
          {
            id: selected.id
          },
          payload
        )
      )
      return
    }
    create(payload)
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
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selected
              ? t('update-something', { something: t('podrazdelenie') })
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
    </Dialog>
  )
}
