import { z } from 'zod'

export const DopOplataFormSchema = z.object({
  mainZarplataId: z.number(),
  paymentId: z.number(),
  from: z.string(),
  to: z.string(),
  percentage: z.number(),
  summa: z.number()
})
export type DopOplataFormValues = z.infer<typeof DopOplataFormSchema>

export const defaultValues: DopOplataFormValues = {
  mainZarplataId: 0,
  paymentId: 0,
  from: '',
  to: '',
  percentage: 0,
  summa: 0
}
