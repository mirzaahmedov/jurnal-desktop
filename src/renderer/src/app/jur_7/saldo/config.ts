import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const SaldoQueryKeys = {
  clean: 'warehouse-saldo/clean',
  getAll: 'warehouse-saldo/all',
  getMonthlySaldo: 'warehouse-saldo/monthly',
  check: 'warehouse-saldo/check',
  create: 'warehouse-saldo/create',
  delete: 'warehouse-saldo/delete'
}

export const SaldoFiltersSchema = z.object({
  date: z.date().optional()
})
export type SaldoFiltersValues = z.infer<typeof SaldoFiltersSchema>

export const defaultValues: SaldoFiltersValues = {
  date: useSelectedMonthStore.getState().startDate
}
export const SaldoFormSchema = z.object({
  month: z.number(),
  year: z.number()
})
export type SaldoFormValues = z.infer<typeof SaldoFormSchema>
