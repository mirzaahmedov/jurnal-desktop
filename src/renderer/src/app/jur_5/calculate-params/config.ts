import { z } from 'zod'

export const CalculateParamsFormSchema = z.object({
  month: z.number(),
  year: z.number(),
  minZar: z.number(),
  mZpGod: z.number(),
  neobMin: z.number(),
  dni5: z.number(),
  chasi5: z.number(),
  dni6: z.number(),
  chasi6: z.number(),
  dni7: z.number(),
  chasi7: z.number(),
  vrach: z.number(),
  medSes: z.number(),
  zaProezd: z.number(),
  poek: z.number(),
  pr1: z.number(),
  pr2: z.number(),
  pr3: z.number(),
  pr4: z.number(),
  pr5: z.number(),
  status: z.boolean()
})
export type CalculateParamsFormValues = z.infer<typeof CalculateParamsFormSchema>

export const defaultValues: CalculateParamsFormValues = {
  month: 0,
  year: 0,
  minZar: 0,
  mZpGod: 0,
  neobMin: 0,
  dni5: 0,
  chasi5: 0,
  dni6: 0,
  chasi6: 0,
  dni7: 0,
  chasi7: 0,
  vrach: 0,
  medSes: 0,
  zaProezd: 0,
  poek: 0,
  pr1: 0,
  pr2: 0,
  pr3: 0,
  pr4: 0,
  pr5: 0,
  status: false
}
