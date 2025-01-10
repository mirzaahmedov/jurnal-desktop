import { APIEndpoints, CRUDService } from '@/common/features/crud'

import type { Podpis } from '@/common/models'
import type { PodpisPayloadType } from './constants'

const podpisService = new CRUDService<Podpis, PodpisPayloadType>({
  endpoint: APIEndpoints.podpis
})

export { podpisService }
