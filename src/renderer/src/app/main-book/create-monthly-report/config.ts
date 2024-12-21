import z from 'zod'

const createMonthlyReportQueryKeys = {
  getAll: 'create-montly-report/all',
  getById: 'create-montly-report',
  create: 'create-montly-report/create',
  update: 'create-montly-report/update',
  delete: 'create-montly-report/delete'
}
const CreateMonthlyReportProvodkaSchema = z.object({
  spravochnik_operatsii_id: z.number(),
  debet_sum: z.number(),
  kredit_sum: z.number()
})
const CreateMonthlyReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  type_document: z.string(),
  childs: z.array(CreateMonthlyReportProvodkaSchema)
})
type CreateMonthlyReportProvodka = z.infer<typeof CreateMonthlyReportProvodkaSchema>
type CreateMonthlyReportForm = z.infer<typeof CreateMonthlyReportFormSchema>

const defaultValues: CreateMonthlyReportForm = {
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
  createMonthlyReportQueryKeys,
  CreateMonthlyReportProvodkaSchema,
  CreateMonthlyReportFormSchema,
  defaultValues
}
export type { CreateMonthlyReportProvodka, CreateMonthlyReportForm }
