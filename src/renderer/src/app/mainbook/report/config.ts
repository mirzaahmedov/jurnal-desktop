import { z } from 'zod'

export const mainbookReportQueryKeys = {
  getAll: 'mainbook-report/all',
  getById: 'mainbook-report',
  create: 'mainbook-report/create',
  update: 'mainbook-report/update',
  delete: 'mainbook-report/delete'
}

export const MainbookReportProvodkaSchema = z.object({
  spravochnik_main_book_schet_id: z.number(),
  debet_sum: z.number(),
  kredit_sum: z.number()
})
export const MainbookReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  type_document: z.string(),
  childs: z.array(MainbookReportProvodkaSchema)
})
export type MainbookReportProvodka = z.infer<typeof MainbookReportProvodkaSchema>
export type MainbookReportValues = z.infer<typeof MainbookReportFormSchema>

export const defaultValues: MainbookReportValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  type_document: '',
  childs: [
    {
      spravochnik_main_book_schet_id: 0,
      debet_sum: 0,
      kredit_sum: 0
    }
  ]
}
