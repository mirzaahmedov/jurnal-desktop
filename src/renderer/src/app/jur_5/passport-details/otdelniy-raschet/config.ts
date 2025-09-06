import { z } from 'zod'

export const OtdelniyRaschetFormSchema = z.object({
  spravochnikBudjetNameId: z.number(),
  mainSchetId: z.number(),
  nachislenieYear: z.number(),
  nachislenieMonth: z.number(),
  docNum: z.number(),
  docDate: z.string(),
  mainZarplataId: z.number(),
  rabDni: z.number(),
  otrabDni: z.number(),
  noch: z.number(),
  prazdnik: z.number(),
  pererabodka: z.number(),
  kazarma: z.number()
})
export type OtdelniyRaschetFormValues = z.infer<typeof OtdelniyRaschetFormSchema>

export const defaultValues: OtdelniyRaschetFormValues = {
  spravochnikBudjetNameId: 0,
  mainSchetId: 0,
  nachislenieYear: 0,
  nachislenieMonth: 0,
  docNum: 0,
  docDate: '',
  mainZarplataId: 0,
  rabDni: 0,
  otrabDni: 0,
  noch: 0,
  prazdnik: 0,
  pererabodka: 0,
  kazarma: 0
}
