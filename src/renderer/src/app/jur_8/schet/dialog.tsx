import type { FinancialReceiptPrixodSchet } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createPrixodSchetSpravochnik } from '@/app/super-admin/prixod-schet/service'
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
import { useSpravochnik } from '@/common/features/spravochnik'
import { capitalize } from '@/common/lib/string'
import { cn } from '@/common/lib/utils'

import { PrixodSchetQueryKeys } from './config'
import { PrixodSchetFormSchema, type PrixodSchetFormValues, PrixodSchetService } from './service'

interface PrixodSchetDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: FinancialReceiptPrixodSchet | null
}
export const PrixodSchetDialog = ({ isOpen, onOpenChange, selected }: PrixodSchetDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PrixodSchetFormSchema)
  })

  const prixodSchetSpravochnik = useSpravochnik(
    createPrixodSchetSpravochnik({
      onChange: (_, schet) => {
        form.setValue('schet_id', schet?.id ?? 0, {
          shouldValidate: true
        })
        form.setValue('schet', schet?.schet ?? '')
        form.setValue('name', schet?.name ?? '')
      }
    })
  )

  const { mutate: createSchet, isPending: isCreatingSchet } = useMutation({
    mutationKey: [PrixodSchetQueryKeys.create],
    mutationFn: PrixodSchetService.create,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PrixodSchetQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateSchet, isPending: isUpdating } = useMutation({
    mutationKey: [PrixodSchetQueryKeys.update],
    mutationFn: PrixodSchetService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PrixodSchetQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateSchet({
        ...values,
        id: selected.id
      })
    } else {
      createSchet(values)
    }
  })

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }

    form.reset(selected)
  }, [form, selected])

  const error = form.formState.errors.schet_id?.message

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selected ? t('schet') : capitalize(t('create-something', { something: t('schet') }))}
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
                      <FormLabel
                        className={cn('text-right col-span-2', error && 'text-destructive')}
                      >
                        {t('name')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          className="col-span-4"
                          onDoubleClick={prixodSchetSpravochnik.open}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6">{error}</FormMessage>
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
                      <FormLabel
                        className={cn('text-right col-span-2', error && 'text-destructive')}
                      >
                        {t('schet')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          className="col-span-4"
                          onDoubleClick={prixodSchetSpravochnik.open}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6">{error}</FormMessage>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isCreatingSchet || isUpdating}
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
  schet: '',
  schet_id: 0
}
