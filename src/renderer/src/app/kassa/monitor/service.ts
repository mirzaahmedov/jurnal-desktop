import type { ResponseMeta, KassaMonitoringType } from '@/common/models'

import { CRUDService } from '@/common/features/crud'
import { ApiEndpoints } from '@/common/features/crud'

export type KassaMonitorMetaType = {
  summa_from: number
  summa_to: number
  prixod_sum: number
  rasxod_sum: number
}

export const kassaMonitorService = new CRUDService<
  KassaMonitoringType,
  undefined,
  undefined,
  KassaMonitorMetaType & ResponseMeta
>({
  endpoint: ApiEndpoints.kassa_monitoring
})
