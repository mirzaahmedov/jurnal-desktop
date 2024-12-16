import type { Access } from '@/common/models'
import type { AccessPayloadType } from './config'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const accessService = new CRUDService<Access, AccessPayloadType>({
  endpoint: ApiEndpoints.access
})
