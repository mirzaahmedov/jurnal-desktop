import { z } from 'zod'

export const WorkplaceFormSchema = z.object({
  vacantId: z.number(),
  prOk: z.string(),
  koef: z.number(),
  rayon: z.string(),
  oklad: z.number(),
  poryadNum: z.number(),
  stavka: z.string(),
  stavkaPrikaz: z.string(),
  okladPrikaz: z.number(),
  spravochnikSostavId: z.number(),
  spravochnikZarpaltaDoljnostId: z.number(),
  spravochnikZarplataIstochnikFinanceId: z.number()
})
export type WorkplaceFormValues = z.infer<typeof WorkplaceFormSchema>

export const defaultValues: WorkplaceFormValues = {
  vacantId: 0,
  prOk: '',
  koef: 0,
  rayon: '',
  oklad: 0,
  poryadNum: 0,
  stavka: '',
  stavkaPrikaz: '',
  okladPrikaz: 0,
  spravochnikSostavId: 0,
  spravochnikZarpaltaDoljnostId: 0,
  spravochnikZarplataIstochnikFinanceId: 0
}
