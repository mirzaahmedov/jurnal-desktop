import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { RegionData } from '@renderer/common/models'

const regionDataService = new CRUDService<RegionData>({
  endpoint: APIEndpoints.tables_count
})

export { regionDataService }
