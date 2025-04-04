import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month/store'

export const ostatokQueryKeys = {
  getAll: 'ostatok/all',
  check: 'ostatok/check',
  create: 'ostatok/create',
  delete: 'ostatok/delete'
}

export const OstatokFiltersSchema = z.object({
  date: z.date().optional()
})
export type OstatokFiltersValues = z.infer<typeof OstatokFiltersSchema>

export const defaultValues: OstatokFiltersValues = {
  date: useSelectedMonthStore.getState().startDate
}
