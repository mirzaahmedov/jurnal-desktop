import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { Expenses } from '@renderer/common/models'
import { http } from '@renderer/common/lib/http'

export const adminMainBookService = new CRUDService<Expenses.AdminReport>({
  endpoint: ApiEndpoints.admin__realcost
})

type UpdateQueryParams = {
  id: number
  status: number
  region_id: number
}
export const adminExpenseUpdateQuery = async ({ id, status, region_id }: UpdateQueryParams) => {
  const response = await http.put(`${ApiEndpoints.admin__realcost}/${id}?region_id=${region_id}`, {
    status
  })
  return response.data
}
