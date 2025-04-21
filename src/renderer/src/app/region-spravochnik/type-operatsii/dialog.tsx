import type { TypeOperatsiiFormValues } from './service'
import type { TypeOperatsii } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { capitalize } from '@/common/lib/string'

import { TypeOperatsiiQueryKeys } from './config'
import { TypeOperatsiiFormSchema, TypeOperatsiiService } from './service'

export interface TypeOperatsiiDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: TypeOperatsii | null
}
export const TypeOperatsiiDialog = ({
  isOpen,
  onOpenChange,
  selected
}: TypeOperatsiiDialogProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm<TypeOperatsiiFormValues>({
    defaultValues,
    resolver: zodResolver(TypeOperatsiiFormSchema)
  })

  const { mutate: createTypeOperatsii, isPending: isCreating } = useMutation({
    mutationKey: [TypeOperatsiiQueryKeys.create],
    mutationFn: TypeOperatsiiService.create,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [TypeOperatsiiQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateTypeOperatsii, isPending: isUpdating } = useMutation({
    mutationKey: [TypeOperatsiiQueryKeys.update],
    mutationFn: TypeOperatsiiService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [TypeOperatsiiQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateTypeOperatsii({
        ...values,
        id: selected.id
      })
    } else {
      createTypeOperatsii(values)
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
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('type-operatsii')
                : capitalize(t('create-something', { something: t('type-operatsii') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
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

const defaultValues: TypeOperatsiiFormValues = {
  name: '',
  rayon: ''
}
