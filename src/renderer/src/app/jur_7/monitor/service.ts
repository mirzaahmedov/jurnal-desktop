import type { ApiResponseMeta, WarehouseMonitoring } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

interface MonitoringMeta extends ApiResponseMeta {
  prixod_sum: number
  rasxod_sum: number
  page_prixod_sum: number
  page_rasxod_sum: number
  from_summa: number
  to_summa: number
}

export const WarehouseMonitorService = new CRUDService<
  WarehouseMonitoring,
  never,
  never,
  MonitoringMeta
>({
  endpoint: ApiEndpoints.jur7_monitoring
})
