import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const BankSaldoQueryKeys = {
  getById: 'bank-saldo',
  getAll: 'bank-saldo/all',
  getMonthlySaldo: 'bank-saldo/monthly',
  create: 'bank-saldo/create',
  delete: 'bank-saldo/delete',
  auto: 'bank-saldo/auto',
  update: 'bank-saldo/update',
  clean: 'bank-saldo/delete'
}

export const defaultValues: BankSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  summa: 0
}
export const BankSaldoFormSchema = z.object({
  summa: z.number(),
  year: z.number().min(1900),
  month: z.number().min(1),
  main_schet_id: z.number().optional()
})

export type BankSaldoFormValues = z.infer<typeof BankSaldoFormSchema>
