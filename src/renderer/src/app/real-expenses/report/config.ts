import { z } from 'zod'

export const realExpensesReportQueryKeys = {
  getAll: 'real-expenses-report/all',
  getById: 'real-expenses-report',
  create: 'real-expenses-report/create',
  update: 'real-expenses-report/update',
  delete: 'real-expenses-report/delete'
}
export const RealExpensesReportProvodkaSchema = z.object({
  smeta_grafik_id: z.number(),
  debet_sum: z.number(),
  kredit_sum: z.number()
})
export const RealExpensesReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  type_document: z.string(),
  childs: z.array(RealExpensesReportProvodkaSchema)
})
export type RealExpensesReportProvodka = z.infer<typeof RealExpensesReportProvodkaSchema>
export type RealExpensesReportValues = z.infer<typeof RealExpensesReportFormSchema>

export const defaultValues: RealExpensesReportValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  type_document: '',
  childs: [
    {
      smeta_grafik_id: 0,
      debet_sum: 0,
      kredit_sum: 0
    }
  ]
}
