import { APIEndpoints, CRUDService } from '@/common/features/crud'

import type { Bank } from '@/common/models'
import type { BankPayload } from './config'

const bankService = new CRUDService<Bank, BankPayload>({
  endpoint: APIEndpoints.spravochnik_bank
})

export { bankService }
