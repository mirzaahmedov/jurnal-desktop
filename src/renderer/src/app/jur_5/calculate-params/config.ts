import { z } from 'zod'

import { getWorkdaysInMonth } from '@/common/lib/date'

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

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1

export const defaultValues: CalculateParamsFormValues = {
  month,
  year,
  minZar: 0,
  mZpGod: 0,
  neobMin: 0,
  dni5: getWorkdaysInMonth(year, month, 5).workdays,
  chasi5: getWorkdaysInMonth(year, month, 5).workhours,
  dni6: getWorkdaysInMonth(year, month, 6).workdays,
  chasi6: getWorkdaysInMonth(year, month, 6).workhours,
  dni7: getWorkdaysInMonth(year, month, 7).workdays,
  chasi7: getWorkdaysInMonth(year, month, 7).workhours,
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
