import type { ApiResponseMeta, BankMonitoringType } from '@/common/models'

import { ApiEndpoints } from '@/common/features/crud'
import { CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'

export type BankMonitorMeta = {
  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number

  prixod_sum: number
  rasxod_sum: number

  summa_from: number
  summa_to: number
}

export const BankMonitorService = new CRUDService<
  BankMonitoringType,
  undefined,
  undefined,
  BankMonitorMeta & ApiResponseMeta
>({
  endpoint: ApiEndpoints.bank_monitoring
}).use(budjet())
