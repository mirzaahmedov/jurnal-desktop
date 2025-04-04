import type { OX } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { http } from '@/common/lib/http'

export const adminOXService = new CRUDService<OX.AdminReport>({
  endpoint: ApiEndpoints.admin__ox
}).forRequest((type, args) => {
  if (type === 'getById') {
    return {
      url: args.endpoint + '/id'
    }
  }
  return {}
})

type UpdateQueryParams = {
  status: number
  year: number
  month: number
  region_id: number
  budjet_id: number
}
export const adminOXUpdateQuery = async ({
  status,
  month,
  year,
  region_id,
  budjet_id
}: UpdateQueryParams) => {
  const response = await http.put(
    `${ApiEndpoints.admin__ox}`,
    { status },
    {
      params: {
        month,
        year,
        region_id,
        budjet_id
      }
    }
  )
  return response.data
}
