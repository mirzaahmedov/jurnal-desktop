import type { BankSaldoFormValues } from './service'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const BankSaldoQueryKeys = {
  getById: 'bank-saldo',
  getAll: 'bank-saldo/all',
  create: 'bank-saldo/create',
  auto: 'bank-saldo/auto',
  update: 'bank-saldo/update',
  delete: 'bank-saldo/delete'
}

export const defaultValues: BankSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  summa: 0
}
