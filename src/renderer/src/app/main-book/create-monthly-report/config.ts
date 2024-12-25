import { z } from 'zod'

export const openMonthlyReportQueryKeys = {
  getAll: 'open-montly-report/all',
  getById: 'open-montly-report',
  create: 'open-montly-report/create',
  update: 'open-montly-report/update',
  delete: 'open-montly-report/delete'
}
export const OpenMonthlyReportProvodkaSchema = z.object({
  spravochnik_operatsii_id: z.number(),
  debet_sum: z.number(),
  kredit_sum: z.number()
})
export const OpenMonthlyReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  type_document: z.string(),
  childs: z.array(OpenMonthlyReportProvodkaSchema)
})
export type OpenMonthlyReportProvodka = z.infer<typeof OpenMonthlyReportProvodkaSchema>
export type OpenMonthlyReportValues = z.infer<typeof OpenMonthlyReportFormSchema>

export const defaultValues: OpenMonthlyReportValues = {
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
