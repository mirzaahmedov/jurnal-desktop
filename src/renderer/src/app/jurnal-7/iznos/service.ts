import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { Iznos } from '@renderer/common/models'

import { IznosFormValues } from './config'

export const iznosService = new CRUDService<Iznos, IznosFormValues>({
  endpoint: APIEndpoints.jur7_iznos
})
