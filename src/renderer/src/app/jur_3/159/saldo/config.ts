import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const OrganSaldoQueryKeys = {
  getById: 'organ-saldo',
  getAll: 'organ-saldo/all',
  getAutofill: 'organ-saldo/autofill',
  getCheckSaldo: 'organ-saldo/check',
  getMonthlySaldo: 'organ-saldo/monthly',
  create: 'organ-saldo/create',
  auto: 'organ-saldo/auto',
  update: 'organ-saldo/update',
  clean: 'organ-saldo/delete'
}

export const OrganSaldoProvodkaFormSchema = z.object({
  organization_id: z.number(),
  name: z.string().optional(),
  prixod: z.number(),
  rasxod: z.number()
})
export const OrganSaldoFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  childs: z.array(OrganSaldoProvodkaFormSchema)
})

export type OrganSaldoProvodkaFormValues = z.infer<typeof OrganSaldoProvodkaFormSchema>
export type OrganSaldoFormValues = z.infer<typeof OrganSaldoFormSchema>

export const defaultValues: OrganSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  childs: []
}
