import { z } from 'zod'

export const PayrollPaymentFormSchema = z.object({
  mainZarplataId: z.number(),
  percentage: z.number().optional(),
  summa: z.number().optional(),
  paymentId: z.number().min(1)
})
export type PayrollPaymentFormValues = z.infer<typeof PayrollPaymentFormSchema>

export const defaultValues: PayrollPaymentFormValues = {
  mainZarplataId: 0,
  percentage: 0,
  summa: 0,
  paymentId: 0
}

export const PayrollChangePaymentFormSchema = z.object({
  mains: z.array(
    z.object({
      mainZarplataId: z.number()
    })
  ),
  paymentId: z.number(),
  payment: z.any(),
  percentage: z.number(),
  summa: z.number()
})
export type PayrollChangePaymentFormValues = z.infer<typeof PayrollChangePaymentFormSchema>
