import type { PodpisPayloadType } from './config'
import type { Podpis } from '@/common/models'

import { APIEndpoints, CRUDService } from '@/common/features/crud'

const podpisService = new CRUDService<Podpis, PodpisPayloadType>({
  endpoint: APIEndpoints.podpis
})

export { podpisService }
