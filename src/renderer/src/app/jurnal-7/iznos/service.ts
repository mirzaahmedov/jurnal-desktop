import type { IznosFormValues } from './config'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

export const iznosService = new CRUDService<never, IznosFormValues>({
  endpoint: ApiEndpoints.jur7_iznos_summa
})
