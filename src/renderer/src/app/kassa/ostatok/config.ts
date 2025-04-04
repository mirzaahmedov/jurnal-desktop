import type { KassaOstatokFormValues } from './service'

import { useSelectedMonthStore } from '@/common/features/selected-month/store'

export const KassaOstatokQueryKeys = {
  getById: 'kassa-saldo',
  getAll: 'kassa-saldo/all',
  create: 'kassa-saldo/create',
  update: 'kassa-saldo/update',
  delete: 'kassa-saldo/delete'
}

export const defaultValues: KassaOstatokFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  summa: 0
}
