import type { OrganSaldoFormValues } from './service'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const OrganSaldoQueryKeys = {
  getById: 'organ-saldo',
  getAll: 'organ-saldo/all',
  getMonthlySaldo: 'organ-saldo/monthly',
  create: 'organ-saldo/create',
  auto: 'organ-saldo/auto',
  update: 'organ-saldo/update',
  clean: 'organ-saldo/delete'
}

export const defaultValues: OrganSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  summa: 0
}
