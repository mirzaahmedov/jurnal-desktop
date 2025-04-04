import type { KassaOstatok } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NumericInput } from '@/common/components'
import { MonthSelect } from '@/common/components/month-select'
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
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { capitalize } from '@/common/lib/string'

import { KassaOstatokQueryKeys, defaultValues } from './config'
import { KassaOstatokFormSchema, KassaOstatokService } from './service'

interface KassaOstatokDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  selected: KassaOstatok | null
}
export const KassaOstatokDialog = ({ open, onOpenChange, selected }: KassaOstatokDialogProps) => {
  const { t } = useTranslation(['app'])

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(KassaOstatokFormSchema)
  })

  const { mutate: createOstatok, isPending: isCreatingOstatok } = useMutation({
    mutationKey: [KassaOstatokQueryKeys.create],
    mutationFn: KassaOstatokService.create,
    onSuccess(res) {
      toast.success(res?.message)

      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [KassaOstatokQueryKeys.getAll]
      })
      onOpenChange(false)
    }
  })
  const { mutate: updateOstatok, isPending: isUpdating } = useMutation({
    mutationKey: [KassaOstatokQueryKeys.update],
    mutationFn: KassaOstatokService.update,
    onSuccess(res) {
      toast(res?.message)

      queryClient.invalidateQueries({
        queryKey: [KassaOstatokQueryKeys.getAll]
      })
      onOpenChange(false)
    }
  })

  const onSubmit = form.handleSubmit(({ year, month, summa }) => {
    if (selected) {
      updateOstatok({
        id: selected.id,
        year,
        month,
        summa,
        main_schet_id
      })
    } else {
      createOstatok({
        year,
        month,
        summa,
        main_schet_id
      })
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
      onOpenChange={onOpenChange}
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
                name="year"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('year')}</FormLabel>
                      <FormControl>
                        <YearSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          triggerClassName="col-span-4"
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="month"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('month')}</FormLabel>
                      <FormControl>
                        <MonthSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          triggerClassName="col-span-4"
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="summa"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('summa')}</FormLabel>
                      <FormControl>
                        <NumericInput
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
                disabled={isCreatingOstatok || isUpdating}
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
