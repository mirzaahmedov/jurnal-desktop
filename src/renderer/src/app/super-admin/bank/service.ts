import type { Bank } from '@/common/models'
import type { BankPayload } from './config'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

const bankService = new CRUDService<Bank, BankPayload>({
  endpoint: ApiEndpoints.spravochnik_bank
})

export { bankService }
