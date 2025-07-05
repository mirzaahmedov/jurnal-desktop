import { z } from 'zod'

export const PayrollDeductionFormSchema = z.object({
  mainZarplataId: z.number(),
  percentage: z.number(),
  summa: z.number(),
  deductionId: z.number()
})
export type PayrollDeductionFormValues = z.infer<typeof PayrollDeductionFormSchema>

export const defaultValues: PayrollDeductionFormValues = {
  mainZarplataId: 0,
  percentage: 0,
  summa: 0,
  deductionId: 0
}
