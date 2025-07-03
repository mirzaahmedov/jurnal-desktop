import { z } from 'zod'

export const EmploymentFormSchema = z.object({
  id: z.number(),
  mainZarplataId: z.number(),
  rayon: z.string(),
  vacantId: z.number(),
  doljnostName: z.string(),
  spravochnikZarplataDoljnostId: z.number(),
  prikazStart: z.string(),
  dateStart: z.string(),
  stavka: z.string(),
  prikazFinish: z.string(),
  dateFinish: z.string(),
  summa: z.number()
})
export type EmploymentFormValues = z.infer<typeof EmploymentFormSchema>

export const defaultValues: EmploymentFormValues = {
  id: 0,
  mainZarplataId: 0,
  rayon: '',
  vacantId: 0,
  doljnostName: '',
  spravochnikZarplataDoljnostId: 0,
  prikazStart: '',
  dateStart: '',
  stavka: '',
  prikazFinish: '',
  dateFinish: '',
  summa: 0
}
