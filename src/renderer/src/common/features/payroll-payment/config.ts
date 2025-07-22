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

export const PayrollChangePaymentFormSchema = z.object({
  vacants: z.array(
    z.object({
      vacantId: z.number()
    })
  ),
  paymentId: z.number(),
  payment: z.any(),
  percentage: z.number(),
  summa: z.number()
})
export type PayrollChangePaymentFormValues = z.infer<typeof PayrollChangePaymentFormSchema>
