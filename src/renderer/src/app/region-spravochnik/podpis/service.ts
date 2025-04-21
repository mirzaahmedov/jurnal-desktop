import type { PodpisPayloadType } from './config'
import type { Podpis } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const PodpisService = new CRUDService<Podpis, PodpisPayloadType>({
  endpoint: ApiEndpoints.podpis
})
