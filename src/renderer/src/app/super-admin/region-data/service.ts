import type { RegionData } from '@renderer/common/models'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

const regionDataService = new CRUDService<RegionData>({
  endpoint: ApiEndpoints.tables_count
})

export { regionDataService }
