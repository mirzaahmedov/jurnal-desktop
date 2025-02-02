import type { RegionData } from '@renderer/common/models'

import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'

const regionDataService = new CRUDService<RegionData>({
  endpoint: APIEndpoints.tables_count
})

export { regionDataService }
