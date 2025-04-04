import type { AdminPrixodbook, PrixodbookStatus } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const adminPrixodbookService = new CRUDService<
  AdminPrixodbook,
  { status: PrixodbookStatus }
>({
  endpoint: ApiEndpoints.admin_prixodbook
})
