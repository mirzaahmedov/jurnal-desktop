import type { PodpisPayloadType } from './config'
import type { Podpis } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const podpisService = new CRUDService<Podpis, PodpisPayloadType>({
  endpoint: ApiEndpoints.podpis
})
