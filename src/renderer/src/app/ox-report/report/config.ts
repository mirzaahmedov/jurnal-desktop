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
  tulangan_mablag_smeta_buyicha: z.number(),
  kassa_rasxod: z.number(),
  haqiqatda_harajatlar: z.number()
})
export const OXReportFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  childs: z.array(OXReportProvodkaSchema)
})
export type OXReportProvodka = z.infer<typeof OXReportProvodkaSchema>
export type OXReportValues = z.infer<typeof OXReportFormSchema>

export const defaultValues: OXReportValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: [
    {
      smeta_grafik_id: 0,
      tulangan_mablag_smeta_buyicha: 0,
      kassa_rasxod: 0,
      haqiqatda_harajatlar: 0
    }
  ]
}
