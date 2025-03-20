import type { Mainbook, MainbookStatus } from '@renderer/common/models'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet } from '@renderer/common/features/crud/middleware'

export const adminMainbookService = new CRUDService<Mainbook, { status: MainbookStatus }>({
  endpoint: ApiEndpoints.admin_mainbook
}).use(budjet())
