import type { BankSaldo } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NumericInput } from '@/common/components'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { MonthSelect } from '@/common/components/month-select'
import { Button } from '@/common/components/ui/button'
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

import { BankSaldoQueryKeys, defaultValues } from './config'
import { BankSaldoFormSchema, BankSaldoService } from './service'

interface BankSaldoDialogProps {
  isOpen: boolean
  onOpenChange: (value: boolean) => void
  selected: BankSaldo | null
}
export const BankSaldoDialog = ({ isOpen, onOpenChange, selected }: BankSaldoDialogProps) => {
  const { t } = useTranslation(['app'])
  const { startDate } = useSelectedMonthStore()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(BankSaldoFormSchema)
  })

  const { mutate: createSaldo, isPending: isCreatingSaldo } = useMutation({
    mutationKey: [BankSaldoQueryKeys.create],
    mutationFn: BankSaldoService.create,
    onSuccess(res) {
      toast.success(res?.message)

      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [BankSaldoQueryKeys.getAll]
      })
      onOpenChange(false)

      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  })
  const { mutate: updateSaldo, isPending: isUpdatingSaldo } = useMutation({
    mutationKey: [BankSaldoQueryKeys.update],
    mutationFn: BankSaldoService.update,
    onSuccess(res) {
      toast?.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [BankSaldoQueryKeys.getAll]
      })
      onOpenChange(false)

      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  })

  const onSubmit = form.handleSubmit(({ year, month, summa }) => {
    if (selected) {
      updateSaldo({
        id: selected.id,
        year,
        month,
        summa,
        main_schet_id
      })
    } else {
      createSaldo({
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
  useEffect(() => {
    if (!isOpen && !selected) {
      form.setValue('year', startDate.getFullYear())
      form.setValue('month', startDate.getMonth() + 1)
      form.reset(
        {},
        {
          keepValues: true
        }
      )
    }
  }, [isOpen, selected, form, startDate])

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
                            readOnly={!!selected}
                            value={field.value}
                            onValueChange={field.onChange}
                            className="col-span-4"
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
                            readOnly={!!selected}
                            value={field.value}
                            onValueChange={field.onChange}
                            className="col-span-4"
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
      </DialogOverlay>
    </DialogTrigger>
  )
}
