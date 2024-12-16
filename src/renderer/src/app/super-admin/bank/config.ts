import { z } from 'zod'

const BankFormSchema = z.object({
  bank_name: z.string(),
  mfo: z.string()
})
type BankPayload = z.infer<typeof BankFormSchema>

const bankQueryKeys = {
  getAll: 'podpis/all',
  getById: 'podpis',
  create: 'podpis/create',
  update: 'podpis/update',
  delete: 'podpis/delete'
}

const defaultValues: BankPayload = {
  bank_name: '',
  mfo: ''
}

export { BankFormSchema, bankQueryKeys, defaultValues }
export type { BankPayload }
