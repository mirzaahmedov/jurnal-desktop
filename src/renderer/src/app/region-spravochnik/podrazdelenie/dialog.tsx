import type { Podrazdelenie } from '@/common/models'
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

import { PodrazdelenieQueryKeys } from './config'
import {
  PodrazdelenieFormSchema,
  type PodrazdelenieFormValues,
  PodrazdelenieService
} from './service'

interface PodrazdelenieDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: Podrazdelenie | null
}
export const PodrazdelenieDialog = ({
  isOpen,
  onOpenChange,
  selected
}: PodrazdelenieDialogProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm<PodrazdelenieFormValues>({
    defaultValues,
    resolver: zodResolver(PodrazdelenieFormSchema)
  })

  const { mutate: createPodrazdelenie, isPending: isCreating } = useMutation({
    mutationKey: [PodrazdelenieQueryKeys.create],
    mutationFn: PodrazdelenieService.create,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodrazdelenieQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updatePodrazdelenie, isPending: isUpdating } = useMutation({
    mutationKey: [PodrazdelenieQueryKeys.update],
    mutationFn: PodrazdelenieService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodrazdelenieQueryKeys.getAll]
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
    } else {
      createPodrazdelenie(values)
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('podrazdelenie')
                : capitalize(t('create-something', { something: t('podrazdelenie') }))}
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

const defaultValues: PodrazdelenieFormValues = {
  name: '',
  rayon: ''
}
