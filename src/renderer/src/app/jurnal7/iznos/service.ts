import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'

import { Iznos } from '@renderer/common/models'

export const iznosService = new CRUDService<Iznos>({
  endpoint: APIEndpoints.jur7_iznos
})
