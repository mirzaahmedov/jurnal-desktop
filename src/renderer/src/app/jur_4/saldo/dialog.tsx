import type { PodotchetSaldo } from '@/common/models'

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
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { capitalize } from '@/common/lib/string'

import { PodotchetSaldoQueryKeys, defaultValues } from './config'
import { PodotchetSaldoFormSchema, PodotchetSaldoService } from './service'

interface PodotchetSaldoDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  selected: PodotchetSaldo | null
}
export const PodotchetSaldoDialog = ({
  open,
  onOpenChange,
  selected
}: PodotchetSaldoDialogProps) => {
  const { t } = useTranslation(['app'])
  const { startDate } = useSelectedMonthStore()

  const { main_schet_id, jur4_schet_id } = useRequisitesStore()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PodotchetSaldoFormSchema)
  })

  const { mutate: createSaldo, isPending: isCreatingSaldo } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.create],
    mutationFn: PodotchetSaldoService.create,
    onSuccess(res) {
      toast.success(res?.message)

      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      onOpenChange(false)
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  })
  const { mutate: updateSaldo, isPending: isUpdatingSaldo } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.update],
    mutationFn: PodotchetSaldoService.update,
    onSuccess(res) {
      toast?.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      onOpenChange(false)
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  })

  const onSubmit = form.handleSubmit(({ year, month, summa }) => {
    if (selected) {
      updateSaldo({
        id: selected.id,
        year,
        month,
        summa,
        main_schet_id,
        schet_id: jur4_schet_id
      })
    } else {
      createSaldo({
        year,
        month,
        summa,
        main_schet_id,
        schet_id: jur4_schet_id
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
  useEffect(() => {
    if (!open && !selected) {
      form.setValue('year', startDate.getFullYear())
      form.setValue('month', startDate.getMonth() + 1)
      form.reset(
        {},
        {
          keepValues: true
        }
      )
    }
  }, [open, selected, form, startDate])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? capitalize(t('update-something', { something: t('pages.saldo') }))
              : capitalize(t('create-something', { something: t('pages.saldo') }))}
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
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
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
                disabled={isCreatingSaldo || isUpdatingSaldo}
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
