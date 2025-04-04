import type { RegionData } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

const regionDataService = new CRUDService<RegionData>({
  endpoint: ApiEndpoints.tables_count
})

export { regionDataService }
