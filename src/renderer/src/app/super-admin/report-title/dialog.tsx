import type { ReportTitle } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
import { useToast } from '@/common/hooks/use-toast'

import { unitQueryKeys } from './config'
import { ReportTitleFormSchema, type ReportTitleFormValues, reportTitleService } from './service'

type UnitDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  selected: ReportTitle | null
}
const UnitDialog = ({ open, onChangeOpen, selected }: UnitDialogProps) => {
  const { toast } = useToast()
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const form = useForm<ReportTitleFormValues>({
    defaultValues,
    resolver: zodResolver(ReportTitleFormSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [unitQueryKeys.create],
    mutationFn: reportTitleService.create,
    onSuccess() {
      toast({
        title: 'Роль успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [unitQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать роль',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [unitQueryKeys.update],
    mutationFn: reportTitleService.update,
    onSuccess() {
      toast({
        title: 'Роль успешно обновлена'
      })
      queryClient.invalidateQueries({
        queryKey: [unitQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить роль',
        description: error.message
      })
    }
  })

  const onSubmit = (payload: ReportTitleFormValues) => {
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
              ? t('update-something', { something: t('pages.edin') })
              : t('create-something', { something: t('pages.edin') })}
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
  name: ''
} satisfies ReportTitleFormValues

export { UnitDialog }
