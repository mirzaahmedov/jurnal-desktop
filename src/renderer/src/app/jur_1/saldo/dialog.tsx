import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { KassaSaldoQueryKeys, defaultValues } from './config'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/common/components/ui/button'
import type { KassaSaldo } from '@/common/models'
import { KassaSaldoFormSchema } from './config'
import { KassaSaldoService } from './service'
import { MonthSelect } from '@/common/components/month-select'
import { NumericInput } from '@/common/components'
import { YearSelect } from '@/common/components/year-select'
import { capitalize } from '@/common/lib/string'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useTranslation } from 'react-i18next'
import { useYearFilter } from './filters'
import { zodResolver } from '@hookform/resolvers/zod'

interface KassaSaldoDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  selected: KassaSaldo | null
}
export const KassaSaldoDialog = ({ open, onOpenChange, selected }: KassaSaldoDialogProps) => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const queryClient = useQueryClient()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { startDate } = useSelectedMonthStore()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: year ?? new Date().getFullYear()
    },
    resolver: zodResolver(KassaSaldoFormSchema)
  })

  const { mutate: createSaldo, isPending: isCreatingOstatok } = useMutation({
    mutationKey: [KassaSaldoQueryKeys.create],
    mutationFn: KassaSaldoService.create,
    onSuccess(res) {
      toast.success(res?.message)

      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [KassaSaldoQueryKeys.getAll]
      })
      onOpenChange(false)
      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })
  const { mutate: updateSaldo, isPending: isUpdating } = useMutation({
    mutationKey: [KassaSaldoQueryKeys.update],
    mutationFn: KassaSaldoService.update,
    onSuccess(res) {
      toast?.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [KassaSaldoQueryKeys.getAll]
      })
      onOpenChange(false)
      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
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
      form.reset({
        ...defaultValues,
        year: year ?? new Date().getFullYear()
      })
      return
    }

    form.reset(selected)
  }, [form, selected, year])
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
    <DialogTrigger
      isOpen={open}
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
                            isReadOnly={!!selected}
                            selectedKey={field.value}
                            onSelectionChange={(value) => field.onChange(value ?? 0)}
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
                      <div className="grid grid-cols-6 items-center gap-x-4">
                        <FormLabel className="text-right col-span-2">{t('month')}</FormLabel>
                        <FormControl className="block">
                          <MonthSelect
                            isReadOnly={!!selected}
                            selectedKey={field.value}
                            onSelectionChange={(value) => field.onChange(value ?? 0)}
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
                  disabled={isCreatingOstatok || isUpdating}
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
