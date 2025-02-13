import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import type { Iznos } from '@renderer/common/models'

import type { IznosFormValues } from './config'

export const iznosService = new CRUDService<Iznos, IznosFormValues>({
  endpoint: APIEndpoints.jur7_iznos
})
