import type { PodpisPayloadType } from './config'
import type { ApiResponse, Podpis, PodpisType } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export class PodpisCRUDService extends CRUDService<Podpis, PodpisPayloadType> {
  constructor() {
    super({
      endpoint: ApiEndpoints.podpis
    })

    this.getPodpisTypes = this.getPodpisTypes.bind(this)
  }

  async getPodpisTypes() {
    const res = await this.client.get<ApiResponse<PodpisType[]>>(
      `${ApiEndpoints.constants}/podpis-type`
    )
    return res.data
  }
}

export const PodpisService = new PodpisCRUDService()
