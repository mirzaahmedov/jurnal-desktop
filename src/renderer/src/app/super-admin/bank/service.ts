import type { BankFormValues } from './config'
import type { Bank } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const BankService = new CRUDService<Bank, BankFormValues>({
  endpoint: ApiEndpoints.spravochnik_bank
})
