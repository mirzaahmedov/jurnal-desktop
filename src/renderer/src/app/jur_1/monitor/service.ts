import type { ApiResponseMeta, KassaMonitoringType } from '@/common/models'

import { ApiEndpoints } from '@/common/features/crud'
import { CRUDService } from '@/common/features/crud'

export type KassaMonitorMetaType = {
  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number

  prixod_sum: number
  rasxod_sum: number
  summa_from: number
  summa_to: number
}

export const KassaMonitorService = new CRUDService<
  KassaMonitoringType,
  undefined,
  undefined,
  KassaMonitorMetaType & ApiResponseMeta
>({
  endpoint: ApiEndpoints.kassa_monitoring
})
