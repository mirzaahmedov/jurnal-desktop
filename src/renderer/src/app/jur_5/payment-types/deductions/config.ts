import { z } from 'zod'

export const DeductionFormSchema = z.object({
  id: z.number(),
  code: z.number(),
  name: z.string(),
  shortName: z.string(),
  debitAccount: z.string(),
  creditAccount: z.string(),
  subAccount: z.string(),
  calculationFormula: z.string()
})

export type DeductionFormValues = z.infer<typeof DeductionFormSchema>

export const defaultValues: DeductionFormValues = {
  id: 0,
  code: 0,
  name: '',
  shortName: '',
  debitAccount: '',
  creditAccount: '',
  subAccount: '',
  calculationFormula: ''
}
