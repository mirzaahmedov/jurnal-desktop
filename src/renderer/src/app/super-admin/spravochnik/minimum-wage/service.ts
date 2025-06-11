import { ApiEndpoints, CRUDService } from '@/common/features/crud'

import type { ApiResponse } from '@/common/models'

export interface MinimumWage {
  id: number
  summa: number
  created_at: string
  updated_at: string
  isdeleted: boolean
}

export class MinimumWageServiceBuilder extends CRUDService<
  MinimumWage,
  Pick<MinimumWage, 'summa'>
> {
  QueryKeys = {
    GetWage: 'minimum-wage/get-wage',
    Update: 'minimum-wage/update'
  }
  constructor() {
    super({
      endpoint: ApiEndpoints.admin_minimum_wage
    })

    this.getWage = this.getWage.bind(this)
  }
  async getWage() {
    const res = await this.client.get<ApiResponse<MinimumWage>>(this.endpoint)
    return res.data
  }
}

export const MinimumWageService = new MinimumWageServiceBuilder().forRequest((type, args) => {
  if (type === 'update') {
    return {
      url: args.endpoint
    }
  }
  return {}
})
