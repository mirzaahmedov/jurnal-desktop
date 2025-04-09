import type { PodotchetSaldoFormValues } from './service'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const PodotchetSaldoQueryKeys = {
  getById: 'podotchet-saldo',
  getAll: 'podotchet-saldo/all',
  getMonthlySaldo: 'podotchet-saldo/monthly',
  create: 'podotchet-saldo/create',
  auto: 'podotchet-saldo/auto',
  update: 'podotchet-saldo/update',
  clean: 'podotchet-saldo/delete'
}

export const defaultValues: PodotchetSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  summa: 0
}
