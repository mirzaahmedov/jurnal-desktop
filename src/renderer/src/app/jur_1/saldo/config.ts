import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const KassaSaldoQueryKeys = {
  getById: 'kassa-saldo',
  getAll: 'kassa-saldo/all',
  getMonthlySaldo: 'kassa-saldo/monthly',
  create: 'kassa-saldo/create',
  auto: 'kassa-saldo/auto',
  update: 'kassa-saldo/update',
  clean: 'kassa-saldo/clean',
  delete: 'kassa-saldo/delete'
}

export const defaultValues: KassaSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  summa: 0
}

export const KassaSaldoFormSchema = z.object({
  summa: z.number(),
  year: z.number().min(1900),
  month: z.number().min(1),
  main_schet_id: z.number().optional()
})

export type KassaSaldoFormValues = z.infer<typeof KassaSaldoFormSchema>
