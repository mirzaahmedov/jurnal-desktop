import { z } from 'zod'

export const oxReportQueryKeys = {
  getAll: 'ox-report/all',
  getById: 'ox-report',
  create: 'ox-report/create',
  update: 'ox-report/update',
  delete: 'ox-report/delete'
}

export const OXReportProvodkaSchema = z.object({
  smeta_grafik_id: z.number(),
  allocated_amount: z.number(),
  real_rasxod: z.number(),
  kassa_rasxod: z.number()
})
export const OXReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  type_document: z.string(),
  childs: z.array(OXReportProvodkaSchema)
})
export type OXReportProvodka = z.infer<typeof OXReportProvodkaSchema>
export type OXReportValues = z.infer<typeof OXReportFormSchema>

export const defaultValues: OXReportValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  type_document: '',
  childs: [
    {
      smeta_grafik_id: 0,
      allocated_amount: 0,
      real_rasxod: 0,
      kassa_rasxod: 0
    }
  ]
}
