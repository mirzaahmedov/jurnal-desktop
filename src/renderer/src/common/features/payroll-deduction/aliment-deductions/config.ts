import { z } from 'zod'

export const AlimentDeductionFormSchema = z.object({
  mainZarplataId: z.number(),
  deductionId: z.number(),
  poluchatelFio: z.string(),
  cardNumber: z.string(),
  organizationId: z.number()
})

export type AlimentDeductionFormValues = z.infer<typeof AlimentDeductionFormSchema>

export const defaultValues: AlimentDeductionFormValues = {
  mainZarplataId: 0,
  deductionId: 0,
  poluchatelFio: '',
  cardNumber: '',
  organizationId: 0
}
