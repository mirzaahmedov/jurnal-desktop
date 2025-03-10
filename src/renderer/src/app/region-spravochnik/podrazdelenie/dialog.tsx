import type { Podrazdelenie } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

import { podrazdelenieQueryKeys } from './constants'
import {
  PodrazdelenieFormSchema,
  type PodrazdelenieFormValues,
  podrazdelenieService
} from './service'

interface PodrazdelenieDialogProps {
  open: boolean
  onChangeOpen(value: boolean): void
  selected: Podrazdelenie | null
}
export const PodrazdelenieDialog = ({ open, onChangeOpen, selected }: PodrazdelenieDialogProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm<PodrazdelenieFormValues>({
    defaultValues,
    resolver: zodResolver(PodrazdelenieFormSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [podrazdelenieQueryKeys.create],
    mutationFn: podrazdelenieService.create,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [podrazdelenieQueryKeys.getAll]
      })
      onChangeOpen(false)
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [podrazdelenieQueryKeys.update],
    mutationFn: podrazdelenieService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [podrazdelenieQueryKeys.getAll]
      })
      onChangeOpen(false)
    }
  })

  const onSubmit = (payload: PodrazdelenieFormValues) => {
    if (selected) {
      update(Object.assign(payload, { id: selected.id }))
    } else {
      create(payload)
    }
  }

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }

    form.reset(selected)
  }, [form, selected])

  return (
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? t('update-something', { something: t('podrazdelenie') })
              : t('create-something', { something: t('podrazdelenie') })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
    </Dialog>
  )
}

const defaultValues = {
  name: '',
  rayon: ''
} satisfies PodrazdelenieFormValues

export default PodrazdelenieDialog
