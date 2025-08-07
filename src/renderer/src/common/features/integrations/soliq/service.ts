import type { SoliqOrganization } from './model'
import type { ApiResponse } from '@/common/models'

import { http } from '@/common/lib/http'

export class SoliqIntegrationService {
  static endpoint = 'int'

  static QueryKeys = {
    OrganizationByInn: 'organization/by-inn'
  }

  static async findOrganizationByInn(tin: string) {
    const res = await http.post<ApiResponse<SoliqOrganization>>(
      `${SoliqIntegrationService.endpoint}/organization/by-inn`,
      {
        tin
      }
    )
    return res.data
  }
}
