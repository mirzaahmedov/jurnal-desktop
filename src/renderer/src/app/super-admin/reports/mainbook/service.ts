import type { AdminMainbook, MainbookStatus } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const adminMainbookService = new CRUDService<AdminMainbook, { status: MainbookStatus }>({
  endpoint: ApiEndpoints.admin_mainbook
})
