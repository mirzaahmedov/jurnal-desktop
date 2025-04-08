import type { OrganSaldoFormValues } from './service'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const BankSaldoQueryKeys = {
  getById: 'bank-saldo',
  getAll: 'bank-saldo/all',
  getMonthlySaldo: 'bank-saldo/monthly',
  create: 'bank-saldo/create',
  auto: 'bank-saldo/auto',
  update: 'bank-saldo/update',
  clean: 'bank-saldo/delete'
}

export const defaultValues: OrganSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  summa: 0
}
