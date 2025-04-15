import type { OrganizationMonitor, ResponseMeta } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { jur3_schet_152, main_schet } from '@/common/features/crud/middleware'

interface OrganMonitorMeta extends ResponseMeta {
  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number
  prixod_sum: number
  rasxod_sum: number
  summa_from: number
  summa_to: number
  total_sum: number
}

export const OrganMonitoringService = new CRUDService<
  OrganizationMonitor,
  undefined,
  undefined,
  OrganMonitorMeta
>({
  endpoint: ApiEndpoints.organ_152_monitoring
})
  .use(main_schet())
  .use(jur3_schet_152())
