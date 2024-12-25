import z from 'zod'

export const completeMonthlyReportQueryKeys = {
  getAll: 'complete-montly-report/all',
  getById: 'complete-montly-report',
  getInfo: 'complete-montly-report/info',
  create: 'complete-montly-report/create',
  update: 'complete-montly-report/update',
  delete: 'complete-montly-report/delete'
}

export const CompleteMonthlyReportProvodkaSchema = z.object({
  spravochnik_operatsii_id: z.number(),
  debet_sum: z.number(),
  kredit_sum: z.number()
})
export const CompleteMonthlyReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  type_document: z.string(),
  childs: z.array(CompleteMonthlyReportProvodkaSchema)
})
export type CompleteMonthlyReportProvodka = z.infer<typeof CompleteMonthlyReportProvodkaSchema>
export type CompleteMonthlyReportValues = z.infer<typeof CompleteMonthlyReportFormSchema>

export const defaultValues: CompleteMonthlyReportValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  type_document: '',
  childs: [
    {
      spravochnik_operatsii_id: 0,
      debet_sum: 0,
      kredit_sum: 0
    }
  ]
}
