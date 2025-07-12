import type { ApiResponse, Constant } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export class ConstantServiceBuilder extends CRUDService<unknown, unknown> {
  QueryKeys = {
    GetRegions: 'constants/regions',
    GetDistricts: 'constants/districts'
  }

  constructor() {
    super({
      endpoint: ApiEndpoints.constants
    })

    this.getRegions = this.getRegions.bind(this)
    this.getDistricts = this.getDistricts.bind(this)
  }

  async getRegions() {
    const res = await this.client.get<ApiResponse<Constant.Region[]>>(`${this.endpoint}/regions`)
    return res.data
  }
  async getDistricts() {
    const res = await this.client.get<ApiResponse<Constant.District[]>>(
      `${this.endpoint}/districts`
    )
    return res.data
  }
}

export const ConstantService = new ConstantServiceBuilder()
