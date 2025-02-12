import type { Pereotsenka } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
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
import { SpravochnikInput } from '@/common/features/spravochnik'
import { useSpravochnik } from '@/common/features/spravochnik'
import { toast } from '@/common/hooks/use-toast'
import { extendObject } from '@/common/lib/utils'

import { createGroupSpravochnik } from '../group/service'
import { PereotsenkaFormSchema, defaultValues, pereotsenkaQueryKeys } from './config'
import { pereotsenkaService } from './service'

type PereotsenkaDialogProps = {
  data: null | Pereotsenka
  open: boolean
  onClose: () => void
}
const PereotsenkaDialog = (props: PereotsenkaDialogProps) => {
  const { data, open, onClose } = props

  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PereotsenkaFormSchema)
  })

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
    mutationKey: [pereotsenkaQueryKeys.create],
    mutationFn: pereotsenkaService.create,
    onSuccess() {
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [pereotsenkaQueryKeys.getAll]
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
    mutationKey: [pereotsenkaQueryKeys.update],
    mutationFn: pereotsenkaService.update,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [pereotsenkaQueryKeys.getAll]
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
      form.reset({
        ...data,
        pereotsenka_foiz: Number(data.pereotsenka_foiz)
      })
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

  console.log(form.formState.errors)

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('update-something', { something: t('pages.pereotsenka') })}</DialogTitle>
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
    </Dialog>
  )
}

export { PereotsenkaDialog }
