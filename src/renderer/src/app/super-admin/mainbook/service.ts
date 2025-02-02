import type { Mainbook } from '@renderer/common/models'

import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { http } from '@renderer/common/lib/http'

export const adminMainbookService = new CRUDService<Mainbook.AdminReport>({
  endpoint: APIEndpoints.admin__mainbook
}).forRequest((type, args) => {
  if (type === 'getById') {
    return {
      url: args.endpoint + '/id'
    }
  }
  return {}
})

type UpdateParams = {
  status: number
  region_id: number
  budjet_id: number
  year: number
  month: number
}
export const adminMainbookUpdateQuery = async ({
  status,
  region_id,
  budjet_id,
  year,
  month
}: UpdateParams) => {
  const response = await http.put(
    `${APIEndpoints.admin__mainbook}`,
    {
      status
    },
    {
      params: {
        region_id,
        budjet_id,
        month,
        year
      }
    }
  )
  return response.data
}
