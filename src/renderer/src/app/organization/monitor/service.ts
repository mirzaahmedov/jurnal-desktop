import type { OrganizationMonitor, ResponseMeta } from '@/common/models'

import { APIEndpoints, CRUDService } from '@/common/features/crud'

type OrgMonitorMetaType = {
  summa_prixod: number
  summa_rasxod: number
  summa_from: number
  summa_from_prixod: number
  summa_from_rasxod: number
  summa_to: number
  summa_to_prixod: number
  summa_to_rasxod: number
}

const orgMonitorService = new CRUDService<
  OrganizationMonitor,
  undefined,
  undefined,
  ResponseMeta & OrgMonitorMetaType
>({
  endpoint: APIEndpoints.organization_monitoring
})

export { orgMonitorService as orgMonitoringService }
