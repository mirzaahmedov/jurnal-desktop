import type { AdmonUserFormValues } from './config'
import type { User } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const AdminUserService = new CRUDService<User, AdmonUserFormValues>({
  endpoint: ApiEndpoints.admin_user
})
