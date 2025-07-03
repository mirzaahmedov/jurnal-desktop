import { z } from 'zod'

export const WorkplaceFormSchema = z.object({
  vacantId: z.number(),
  prOk: z.string(),
  koef: z.number(),
  setka: z.number(),
  rayon: z.string(),
  oklad: z.number(),
  poryadNum: z.number(),
  stavka: z.number(),
  stavkaPrikaz: z.string(),
  okladPrikaz: z.number(),
  spravochnikSostavId: z.number(),
  spravochnikZarpaltaDoljnostId: z.number(),
  spravochnikZarplataIstochnikFinanceId: z.number(),
  mainZarplataId: z.number().optional().nullable()
})
export type WorkplaceFormValues = z.infer<typeof WorkplaceFormSchema>

export const defaultValues: WorkplaceFormValues = {
  vacantId: 0,
  prOk: '',
  koef: 0,
  setka: 0,
  rayon: '',
  oklad: 0,
  poryadNum: 0,
  stavka: 0,
  stavkaPrikaz: '',
  okladPrikaz: 0,
  spravochnikSostavId: 0,
  spravochnikZarpaltaDoljnostId: 0,
  spravochnikZarplataIstochnikFinanceId: 0
}
