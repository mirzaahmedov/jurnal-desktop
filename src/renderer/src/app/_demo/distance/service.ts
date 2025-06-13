import { ApiEndpoints, CRUDService } from '@/common/features/crud'

import type { DistanceFormValues } from './config'

export interface Distance {
  id: number
  from_district_id: number
  to_district_id: number
  distance_km: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  from: string
  to: string
}

export const DistanceService = new CRUDService<Distance, DistanceFormValues>({
  endpoint: ApiEndpoints.admin_distance
})
