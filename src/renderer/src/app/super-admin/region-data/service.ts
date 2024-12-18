import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { RegionData } from '@renderer/common/models'

const regionDataService = new CRUDService<RegionData>({
  endpoint: ApiEndpoints.tables_count
})

export { regionDataService }
