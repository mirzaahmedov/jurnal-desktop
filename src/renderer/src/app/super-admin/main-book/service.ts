import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { Mainbook } from '@renderer/common/models'
import { http } from '@renderer/common/lib/http'

export const adminMainBookService = new CRUDService<Mainbook.AdminReport>({
  endpoint: ApiEndpoints.admin__main_book
})

type UpdateParams = {
  id: number
  status: number
  region_id: number
}
export const adminMainBookUpdateQuery = async ({ id, status, region_id }: UpdateParams) => {
  const response = await http.put(`${ApiEndpoints.admin__main_book}/${id}?region_id=${region_id}`, {
    status
  })
  return response.data
}
