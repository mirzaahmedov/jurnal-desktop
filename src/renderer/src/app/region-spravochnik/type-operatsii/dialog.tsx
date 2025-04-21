import type { TypeOperatsiiFormValues } from './service'
import type { TypeOperatsii } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormDialog } from '@/common/components/dialog'
import { Button } from '@/common/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

import { typeOperatsiiQueryKeys } from './config'
import { TypeOperatsiiFormSchema, TypeOperatsiiService } from './service'

export interface TypeOperatsiiDialogProps {
  open: boolean
  onChangeOpen(value: boolean): void
  selected: TypeOperatsii | null
}
export const TypeOperatsiiDialog = ({ open, onChangeOpen, selected }: TypeOperatsiiDialogProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm<TypeOperatsiiFormValues>({
    defaultValues,
    resolver: zodResolver(TypeOperatsiiFormSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [typeOperatsiiQueryKeys.create],
    mutationFn: TypeOperatsiiService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [typeOperatsiiQueryKeys.getAll]
      })
      onChangeOpen(false)
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [typeOperatsiiQueryKeys.update],
    mutationFn: TypeOperatsiiService.update,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [typeOperatsiiQueryKeys.getAll]
      })
      onChangeOpen(false)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (selected) {
      update(Object.assign(payload, { id: selected.id }))
    } else {
      create(payload)
    }
  })

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }

    form.reset(selected)
  }, [form, selected])

  return (
    <FormDialog
      open={open}
      onChangeOpen={onChangeOpen}
      name={
        selected
          ? t('update-something', { something: t('type-operatsii') })
          : t('create-something', { something: t('type-operatsii') })
      }
      form={form}
      onSubmit={onSubmit}
      footer={
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
        >
          {t('save')}
        </Button>
      }
    >
      <div className="grid gap-4 py-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                <FormLabel className="text-right col-span-2">{t('name')}</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-end col-span-6" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          name="rayon"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                <FormLabel className="text-right col-span-2">{t('rayon')}</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-end col-span-6" />
              </div>
            </FormItem>
          )}
        />
      </div>
    </FormDialog>
  )
}

const defaultValues = {
  name: '',
  rayon: ''
} satisfies TypeOperatsiiFormValues
