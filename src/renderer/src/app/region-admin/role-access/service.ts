import type { RoleAccessFormValues } from './config'
import type { RoleAccess } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'

export const RoleAccessService = new CRUDService<RoleAccess, RoleAccessFormValues>({
  endpoint: ApiEndpoints.access
}).use(budjet())
