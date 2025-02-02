import type { AdvanceReportPayloadType } from './constants'
import type { Avans } from '@/common/models'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const avansService = new CRUDService<Avans, AdvanceReportPayloadType>({
  endpoint: APIEndpoints.avans
}).use(main_schet())
