import type { Responsible } from '@/common/models'

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
import { extendObject } from '@/common/lib/utils'

import { createPodrazdelenie7Spravochnik } from '../podrazdelenie/service'
import { ResponsibleFormSchema, defaultValues, responsibleQueryKeys } from './constants'
import { responsibleService } from './service'

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
    resolver: zodResolver(ResponsibleFormSchema)
  })

  const podrazdelenieSpravochnik = useSpravochnik(
    createPodrazdelenie7Spravochnik({
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
      toast.success('Материально-ответственное лицо успешно создана')
    },
    onError(error) {
      console.error(error)
      toast.error('Ошибка при создании материально-ответственное лицо: ' + error.message)
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
      toast.success('Материально-ответственное лицо успешно изменена')
    },
    onError(error) {
      console.error(error)
      toast.error('Ошибка при изменении материально-ответственное лицо' + error.message)
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
          <DialogTitle className="titlecase">
            {data
              ? t('update-something', { something: t('responsible') })
              : t('create-something', { something: t('responsible') })}
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

export default ResponsibleDialog
