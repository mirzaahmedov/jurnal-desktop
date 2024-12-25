import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { AdminMainbook } from '@renderer/common/models'

export const adminMainBookService = new CRUDService<AdminMainbook>({
  endpoint: ApiEndpoints.admin__main_book
})
