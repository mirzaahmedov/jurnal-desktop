import type { AdminPrixodbook, PrixodbookStatus } from '@renderer/common/models'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

export const adminPrixodbookService = new CRUDService<
  AdminPrixodbook,
  { status: PrixodbookStatus }
>({
  endpoint: ApiEndpoints.admin_prixodbook
})
