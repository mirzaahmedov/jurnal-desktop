import { z } from 'zod'

export const EmploymentFormSchema = z.object({
  id: z.number().optional(),
  mainZarplataId: z.number().optional(),
  rayon: z.string(),
  vacantId: z.number().optional().nullable(),
  // doljnostName: z.string(),
  spravochnikZarplataDoljnostId: z.number(),
  prikazStart: z.string(),
  dateStart: z.string(),
  stavka: z.number(),
  prikazFinish: z.string(),
  dateFinish: z.string(),
  summa: z.number()
})
export type EmploymentFormValues = z.infer<typeof EmploymentFormSchema>

export const defaultValues: EmploymentFormValues = {
  rayon: '',
  // doljnostName: '',
  spravochnikZarplataDoljnostId: 0,
  prikazStart: '',
  dateStart: '',
  stavka: 0,
  prikazFinish: '',
  dateFinish: '',
  summa: 0
}
