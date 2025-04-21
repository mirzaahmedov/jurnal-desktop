import { z } from 'zod'

export const BankFormSchema = z.object({
  bank_name: z.string(),
  mfo: z.string()
})
export type BankFormValues = z.infer<typeof BankFormSchema>

export const BankQueryKeys = {
  getAll: 'bank/all',
  getById: 'bank',
  create: 'bank/create',
  update: 'bank/update',
  delete: 'bank/delete'
}

export const defaultValues: BankFormValues = {
  bank_name: '',
  mfo: ''
}
