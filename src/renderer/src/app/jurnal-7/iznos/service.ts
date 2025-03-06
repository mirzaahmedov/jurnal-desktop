import type { IznosFormValues } from './config'

import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'

export const iznosService = new CRUDService<never, IznosFormValues>({
  endpoint: APIEndpoints.jur7_iznos_summa
})
