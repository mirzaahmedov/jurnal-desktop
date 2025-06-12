import type { WorkTripFormValues } from './config'
import type { WorkTrip } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { jur4_schet, main_schet } from '@/common/features/crud/middleware'

export const WorkTripService = new CRUDService<WorkTrip, WorkTripFormValues>({
  endpoint: ApiEndpoints.work_trip
})
  .use(main_schet())
  .use(jur4_schet())
