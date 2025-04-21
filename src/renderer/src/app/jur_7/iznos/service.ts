import type { IznosFormValues } from './config'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const IznosService = new CRUDService<never, IznosFormValues>({
  endpoint: ApiEndpoints.jur7_iznos_summa
}).use(main_schet())
