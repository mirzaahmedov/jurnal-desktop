import type { PrixodSchet } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { capitalize } from '@renderer/common/lib/string'
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

import { prixodSchetQueryKeys } from './config'
import { PrixodSchetFormSchema, type PrixodSchetFormValues, PrixodSchetService } from './service'

interface PrixodSchetDialogProps {
  open: boolean
  onChangeOpen: (value: boolean) => void
  selected: PrixodSchet | null
}
export const PrixodSchetDialog = ({ open, onChangeOpen, selected }: PrixodSchetDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PrixodSchetFormSchema)
  })

  const { mutate: createPrixodSchet, isPending: isCreatingPrixodSchet } = useMutation({
    mutationKey: [prixodSchetQueryKeys.create],
    mutationFn: PrixodSchetService.create,
    onSuccess(res) {
      toast.success(res?.message)

      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [prixodSchetQueryKeys.getAll]
      })
      onChangeOpen(false)
    }
  })
  const { mutate: updatePrixodSchet, isPending: isUpdating } = useMutation({
    mutationKey: [prixodSchetQueryKeys.update],
    mutationFn: PrixodSchetService.update,
    onSuccess(res) {
      toast(res?.message)

      queryClient.invalidateQueries({
        queryKey: [prixodSchetQueryKeys.getAll]
      })
      onChangeOpen(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updatePrixodSchet({
        ...values,
        id: selected.id
      })
    } else {
      createPrixodSchet(values)
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
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? capitalize(t('update-something', { something: t('pages.prixod_schets') }))
              : capitalize(t('create-something', { something: t('pages.prixod_schets') }))}
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
                name="schet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('schet')}</FormLabel>
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
                disabled={isCreatingPrixodSchet || isUpdating}
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

const defaultValues: PrixodSchetFormValues = {
  name: '',
  schet: ''
}
