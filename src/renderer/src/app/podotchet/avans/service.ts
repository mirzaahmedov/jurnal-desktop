import type { AdvanceReportPayloadType } from './config'
import type { Avans } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const avansService = new CRUDService<Avans, AdvanceReportPayloadType>({
  endpoint: ApiEndpoints.avans
}).use(main_schet())
