import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const OrganSaldoQueryKeys = {
  getById: 'organ-saldo/159',
  getAll: 'organ-saldo/159/all',
  getAutofill: 'organ-saldo/159/autofill',
  getCheckSaldo: 'organ-saldo/159/check',
  getMonthlySaldo: 'organ-saldo/159/monthly',
  create: 'organ-saldo/159/create',
  auto: 'organ-saldo/159/auto',
  update: 'organ-saldo/159/update',
  clean: 'organ-saldo/159/clean',
  delete: 'organ-saldo/159/delete'
}

export const OrganSaldoSubChildFormSchema = z.object({
  prixod: z.number(),
  rasxod: z.number(),
  contract_id: z.number(),
  summa: z.number()
})
export const OrganSaldoProvodkaFormSchema = z.object({
  _total: z.boolean().optional(),
  organization_id: z.number(),
  name: z.string().optional(),
  bank_klient: z.string().optional(),
  mfo: z.string().optional(),
  inn: z.string().optional(),
  prixod: z.number(),
  rasxod: z.number(),
  summa: z.number().optional().nullable(),
  sub_childs: z.array(OrganSaldoSubChildFormSchema)
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
