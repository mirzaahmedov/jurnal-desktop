import type { BankSaldoFormValues } from './service'

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
