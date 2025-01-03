import { z } from 'zod'

export const expensesReportQueryKeys = {
  getAll: 'expenses-report/all',
  getById: 'expenses-report',
  create: 'expenses-report/create',
  update: 'expenses-report/update',
  delete: 'expenses-report/delete'
}
export const ExpensesReportProvodkaSchema = z.object({
  smeta_grafik_id: z.number(),
  debet_sum: z.number(),
  kredit_sum: z.number()
})
export const ExpensesReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  type_document: z.string(),
  childs: z.array(ExpensesReportProvodkaSchema)
})
export type ExpensesReportProvodka = z.infer<typeof ExpensesReportProvodkaSchema>
export type ExpensesReportValues = z.infer<typeof ExpensesReportFormSchema>

export const defaultValues: ExpensesReportValues = {
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
