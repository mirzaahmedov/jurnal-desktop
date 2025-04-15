import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const OrganSaldoQueryKeys = {
  getById: 'organ-saldo/152',
  getAll: 'organ-saldo/152/all',
  getAutofill: 'organ-saldo/152/autofill',
  getCheckSaldo: 'organ-saldo/152/check',
  getMonthlySaldo: 'organ-saldo/152/monthly',
  create: 'organ-saldo/152/create',
  auto: 'organ-saldo/152/auto',
  update: 'organ-saldo/152/update',
  clean: 'organ-saldo/152/delete'
}

export const OrganSaldoProvodkaFormSchema = z.object({
  _total: z.boolean().optional(),
  organization_id: z.number(),
  name: z.string().optional(),
  prixod: z.number(),
  rasxod: z.number(),
  bank_klient: z.string().optional(),
  mfo: z.string().optional(),
  inn: z.string().optional()
})
export const OrganSaldoFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  organizations: z.array(OrganSaldoProvodkaFormSchema)
})

export type OrganSaldoProvodkaFormValues = z.infer<typeof OrganSaldoProvodkaFormSchema>
export type OrganSaldoFormValues = z.infer<typeof OrganSaldoFormSchema>

export const defaultValues: OrganSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  organizations: []
}
