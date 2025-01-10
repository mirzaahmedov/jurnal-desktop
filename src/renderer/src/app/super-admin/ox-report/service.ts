import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { OX } from '@renderer/common/models'
import { http } from '@renderer/common/lib/http'

export const adminOXService = new CRUDService<OX.AdminReport>({
  endpoint: APIEndpoints.admin__ox
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
    `${APIEndpoints.admin__ox}`,
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
