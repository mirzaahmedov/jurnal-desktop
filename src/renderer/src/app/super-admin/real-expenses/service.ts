import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { RealExpenses } from '@renderer/common/models'
import { http } from '@renderer/common/lib/http'

export const adminRealExpensesService = new CRUDService<RealExpenses.AdminReport>({
  endpoint: ApiEndpoints.admin__realcost
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
export const adminRealExpenseUpdateQuery = async ({
  status,
  month,
  year,
  region_id,
  budjet_id
}: UpdateQueryParams) => {
  const response = await http.put(
    `${ApiEndpoints.admin__realcost}`,
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
