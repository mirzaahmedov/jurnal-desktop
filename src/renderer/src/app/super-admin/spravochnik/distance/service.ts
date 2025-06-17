import type { DistanceFormValues } from './config'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export interface Distance {
  id: number
  from_region_id: number
  to_region_id: number
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
