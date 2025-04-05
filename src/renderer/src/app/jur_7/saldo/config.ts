import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const ostatokQueryKeys = {
  getAll: 'saldo/all',
  check: 'saldo/check',
  create: 'saldo/create',
  delete: 'saldo/delete'
}

export const OstatokFiltersSchema = z.object({
  date: z.date().optional()
})
export type OstatokFiltersValues = z.infer<typeof OstatokFiltersSchema>

export const defaultValues: OstatokFiltersValues = {
  date: useSelectedMonthStore.getState().startDate
}
