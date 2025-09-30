import type { IHeader } from '@/common/models/headers'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const HeadersService = new CRUDService<IHeader>({
  endpoint: ApiEndpoints.headers
})
