import type { BankMonitoringType, ResponseMeta } from '@/common/models'

import { ApiEndpoints } from '@/common/features/crud'
import { CRUDService } from '@/common/features/crud'

export type BankMonitorMeta = {
  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number

  prixod_sum: number
  rasxod_sum: number

  summa_from: number
  summa_to: number
}

export const bankMonitorService = new CRUDService<
  BankMonitoringType,
  undefined,
  undefined,
  BankMonitorMeta & ResponseMeta
>({
  endpoint: ApiEndpoints.bank_monitoring
})
