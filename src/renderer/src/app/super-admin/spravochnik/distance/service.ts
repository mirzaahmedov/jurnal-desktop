import type { DistanceFormValues } from './config'
import type { ApiResponse } from '@/common/models'

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

export interface GetDistanceArgs {
  from_region_id: number
  to_region_id: number
}

export class DistanceServiceFactory extends CRUDService<Distance, DistanceFormValues> {
  constructor() {
    super({
      endpoint: ApiEndpoints.admin_distance
    })

    this.getDistanceKM = this.getDistanceKM.bind(this)
  }

  async getDistanceKM({ from_region_id, to_region_id }: GetDistanceArgs): Promise<number> {
    try {
      const response = await this.client.get<ApiResponse<Distance[]>>(this.endpoint, {
        params: {
          from_region_id,
          to_region_id,
          page: 1,
          limit: 1
        }
      })
      const distances = response.data?.data || []
      if (
        Array.isArray(distances) &&
        distances.length &&
        typeof distances[0]?.distance_km === 'number'
      ) {
        return distances[0].distance_km
      } else {
        return 0
      }
    } catch (error) {
      console.error('Error fetching distance:', error)
      return 0
    }
  }
}

export const DistanceService = new DistanceServiceFactory()
