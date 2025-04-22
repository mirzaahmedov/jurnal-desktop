import type { RegionData } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const RegionDataService = new CRUDService<RegionData>({
  endpoint: ApiEndpoints.tables_count
})
