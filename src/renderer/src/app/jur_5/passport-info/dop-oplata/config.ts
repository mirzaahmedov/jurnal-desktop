import { z } from 'zod'

export const DopOplataFormSchema = z.object({
  mainZarplataId: z.number(),
  paymentId: z.number(),
  from: z.string().nonempty(),
  to: z.string().nonempty(),
  day: z.number().min(1).nullable().optional(),
  percentage: z.number().optional().nullable(),
  summa: z.number()
})
export type DopOplataFormValues = z.infer<typeof DopOplataFormSchema>

export const defaultValues: DopOplataFormValues = {
  mainZarplataId: 0,
  paymentId: 0,
  from: '',
  to: '',
  day: 0,
  percentage: 0,
  summa: 0
}
