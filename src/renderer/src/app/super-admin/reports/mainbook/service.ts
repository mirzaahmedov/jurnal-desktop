import type { AdminMainbook, MainbookStatus } from '@renderer/common/models'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

export const adminMainbookService = new CRUDService<AdminMainbook, { status: MainbookStatus }>({
  endpoint: ApiEndpoints.admin_mainbook
})
