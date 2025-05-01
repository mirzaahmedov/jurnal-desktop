import type { ResponseMeta, WarehouseMonitoring } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

interface MonitoringMeta extends ResponseMeta {
  page_prixod_sum: number
  page_rasxod_sum: number
  prixod_sum: number
  rasxod_sum: number
}

export const WarehouseMonitorService = new CRUDService<
  WarehouseMonitoring,
  never,
  never,
  MonitoringMeta
>({
  endpoint: ApiEndpoints.jur7_monitoring
})
