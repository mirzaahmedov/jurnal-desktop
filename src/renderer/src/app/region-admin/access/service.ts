import { APIEndpoints, CRUDService } from '@/common/features/crud'

import type { Access } from '@/common/models'
import type { AccessPayloadType } from './config'

export const accessService = new CRUDService<Access, AccessPayloadType>({
  endpoint: APIEndpoints.access
})
