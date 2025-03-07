import type { OrganizationMonitor, ResponseMeta } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

type SummaObject = {
  summa: number
  prixod_sum: number
  rasxod_sum: number
  kursatilgan_hizmatlar_sum_prixod: number
  bank_rasxod_sum_prixod: number
  bajarilgan_ishlar_sum_rasxod: number
  bank_prixod_sum_rasxod: number
  jur7_prixod_sum_rasxod: number
}

type OrgMonitorMetaType = {
  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number
  summa_from_object: SummaObject
  summa_from: number
  summa_to_object: SummaObject
  summa_to: number
  prixod_sum: number
  rasxod_sum: number
  summa_object: SummaObject
}

const orgMonitorService = new CRUDService<
  OrganizationMonitor,
  undefined,
  undefined,
  ResponseMeta & OrgMonitorMetaType
>({
  endpoint: ApiEndpoints.organization_monitoring
})

export { orgMonitorService as orgMonitoringService }
