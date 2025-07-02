import { z } from 'zod'

export const PayrollPaymentFormSchema = z.object({
  mainZarplataId: z.number(),
  percentage: z.number(),
  summa: z.number(),
  paymentId: z.number()
})
export type PayrollPaymentFormValues = z.infer<typeof PayrollPaymentFormSchema>

export const defaultValues: PayrollPaymentFormValues = {
  mainZarplataId: 0,
  percentage: 0,
  summa: 0,
  paymentId: 0
}
