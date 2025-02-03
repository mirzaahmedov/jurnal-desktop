import { z } from 'zod'

const BankFormSchema = z.object({
  bank_name: z.string(),
  mfo: z.string()
})
type BankPayload = z.infer<typeof BankFormSchema>

const bankQueryKeys = {
  getAll: 'bank/all',
  getById: 'bank',
  create: 'bank/create',
  update: 'bank/update',
  delete: 'bank/delete'
}

const defaultValues: BankPayload = {
  bank_name: '',
  mfo: ''
}

export { BankFormSchema, bankQueryKeys, defaultValues }
export type { BankPayload }
