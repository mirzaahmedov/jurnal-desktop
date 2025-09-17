import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const PodotchetSaldoQueryKeys = {
  getById: 'podotchet-saldo',
  getAll: 'podotchet-saldo/all',
  getAutofill: 'podotchet-saldo/autofill',
  getCheckSaldo: 'podotchet-saldo/check',
  getMonthlySaldo: 'podotchet-saldo/monthly',
  create: 'podotchet-saldo/create',
  auto: 'podotchet-saldo/auto',
  update: 'podotchet-saldo/update',
  clean: 'podotchet-saldo/clean',
  delete: 'podotchet-saldo/delete'
}

export const PodotchetSaldoProvodkaFormSchema = z.object({
  _total: z.boolean().optional(),
  podotchet_id: z.number(),
  name: z.string().optional(),
  rayon: z.string().optional(),
  prixod: z.number(),
  rasxod: z.number(),
  summa: z.number().optional().nullable()
})
export const PodotchetSaldoFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  podotchets: z.array(PodotchetSaldoProvodkaFormSchema)
})

export type PodotchetSaldoProvodkaFormValues = z.infer<typeof PodotchetSaldoProvodkaFormSchema>
export type PodotchetSaldoFormValues = z.infer<typeof PodotchetSaldoFormSchema>

export const defaultValues: PodotchetSaldoFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  podotchets: []
}
