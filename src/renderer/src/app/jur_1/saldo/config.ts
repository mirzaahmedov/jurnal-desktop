import type { KassaSaldoFormValues } from './service'

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
