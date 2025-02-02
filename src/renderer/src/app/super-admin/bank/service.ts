import type { BankPayload } from './config'
import type { Bank } from '@/common/models'

import { APIEndpoints, CRUDService } from '@/common/features/crud'

const bankService = new CRUDService<Bank, BankPayload>({
  endpoint: APIEndpoints.spravochnik_bank
})

export { bankService }
