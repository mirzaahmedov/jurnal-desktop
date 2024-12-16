import type { Podpis } from '@/common/models'
import type { PodpisPayloadType } from './constants'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'

const podpisService = new CRUDService<Podpis, PodpisPayloadType>({
  endpoint: ApiEndpoints.podpis
})

export { podpisService }
