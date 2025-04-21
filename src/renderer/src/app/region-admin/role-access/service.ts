import type { RoleAccessFormValues } from './config'
import type { RoleAccess } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const RoleAccessService = new CRUDService<RoleAccess, RoleAccessFormValues>({
  endpoint: ApiEndpoints.access
})
