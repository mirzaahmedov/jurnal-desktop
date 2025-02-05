import type { OrganizationMonitor, ResponseMeta } from '@/common/models'

import { APIEndpoints, CRUDService } from '@/common/features/crud'

type OrgMonitorMetaType = {
  summa_prixod: number
  summa_rasxod: number
  summa_from: {
    prixod: number
    rasxod: number
    summa: number
  }
  summa_to: {
    prixod: number
    rasxod: number
    summa: number
  }
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
