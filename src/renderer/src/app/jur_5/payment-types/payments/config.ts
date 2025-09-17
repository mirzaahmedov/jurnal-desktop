import { z } from 'zod'

export const PaymentFormSchema = z.object({
  id: z.number(),
  code: z.number(),
  name: z.string(),
  nameUz: z.string(),
  isINPSTaxable: z.boolean(),
  isUnionDeductible: z.boolean(),
  isAlimonyDeductible: z.boolean(),
  isIncomeTaxDeductible: z.boolean(),
  isUSTDeductible: z.boolean(),
  expenseAccount: z.string(),
  creditAccount: z.string(),
  subAccount: z.string(),
  sourceFund: z.string(),
  calculationFormula: z.string(),
  isOklad: z.boolean().default(false)
})

export type PaymentFormValues = z.infer<typeof PaymentFormSchema>

export const defaultValues: PaymentFormValues = {
  id: 0,
  code: 0,
  name: '',
  nameUz: '',
  isINPSTaxable: false,
  isUnionDeductible: false,
  isAlimonyDeductible: false,
  isIncomeTaxDeductible: false,
  isUSTDeductible: false,
  expenseAccount: '',
  creditAccount: '',
  subAccount: '',
  sourceFund: '',
  calculationFormula: '',
  isOklad: false
}
