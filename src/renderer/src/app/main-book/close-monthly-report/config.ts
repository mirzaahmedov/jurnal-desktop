import z from 'zod'

const closeMonthlyReportQueryKeys = {
  getAll: 'close-montly-report/all',
  getById: 'close-montly-report',
  create: 'close-montly-report/create',
  update: 'close-montly-report/update',
  delete: 'close-montly-report/delete'
}
const CloseMonthlyReportProvodkaSchema = z.object({
  spravochnik_operatsii_id: z.number(),
  debet_sum: z.number(),
  kredit_sum: z.number()
})
const CloseMonthlyReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  type_document: z.string(),
  childs: z.array(CloseMonthlyReportProvodkaSchema)
})
type CloseMonthlyReportProvodka = z.infer<typeof CloseMonthlyReportProvodkaSchema>
type CloseMonthlyReportForm = z.infer<typeof CloseMonthlyReportFormSchema>

const defaultValues: CloseMonthlyReportForm = {
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

export {
  closeMonthlyReportQueryKeys,
  CloseMonthlyReportProvodkaSchema,
  CloseMonthlyReportFormSchema,
  defaultValues
}
export type { CloseMonthlyReportProvodka, CloseMonthlyReportForm }
