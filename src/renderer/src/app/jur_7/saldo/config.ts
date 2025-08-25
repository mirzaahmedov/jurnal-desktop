import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const MaterialSaldoQueryKeys = {
  clean: 'material-saldo/clean',
  getAll: 'material-saldo/all',
  getAllProducts: 'material-saldo/products',
  getMonthlySaldo: 'material-saldo/monthly',
  check: 'material-saldo/check',
  create: 'material-saldo/create',
  deleteMonth: 'material-saldo/delete-month',
  deleteOne: 'material-saldo/delete'
} as const

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
