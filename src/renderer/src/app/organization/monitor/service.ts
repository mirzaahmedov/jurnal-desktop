import type { ResponseMeta, OrganizationMonitor } from '@/common/models'

import { ApiEndpoints, CRUDService, GetAllQueryKey } from '@/common/features/crud'

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
  endpoint: ApiEndpoints.organization_monitoring
}).forRequest((type, args) => {
  if (type === 'getAll') {
    const orgId = args.ctx!.queryKey[2]
    return {
      url: orgId ? '/organization/monitoring/id' : '/organization/monitoring',
      config: {
        params: {
          ...(args.ctx!.queryKey as GetAllQueryKey)[1],
          organ_id: orgId
        }
      }
    }
  }
  return {}
})

export { orgMonitorService as orgMonitoringService }
