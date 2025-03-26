import type { BankMonitoringType, ResponseMeta } from '@/common/models'

import { ApiEndpoints } from '@/common/features/crud'
import { CRUDService } from '@/common/features/crud'

export type BankMonitorMetaType = {
  summa_from: number
  summa_to: number
  prixod_sum: number
  rasxod_sum: number
}

// {page_prixod_sum: number
//   page_rasxod_sum: number
//   page_total_sum: number

//   summa_from_object?: SummaObject
//   summa_to_object?: SummaObject}

export const bankMonitorService = new CRUDService<
  BankMonitoringType,
  undefined,
  undefined,
  BankMonitorMetaType & ResponseMeta
>({
  endpoint: ApiEndpoints.bank_monitoring
})
