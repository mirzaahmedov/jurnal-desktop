import type { IznosFormValues } from './config'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import { main_schet } from '@renderer/common/features/crud/middleware'

export const iznosService = new CRUDService<never, IznosFormValues>({
  endpoint: ApiEndpoints.jur7_iznos_summa
}).use(main_schet())
