import type { Response } from '@renderer/common/models'

import { ApiEndpoints } from '@renderer/common/features/crud'
import { http } from '@renderer/common/lib/http'

export interface MainbookType {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
}
export const getMainbookTypes = async () => {
  const res = await http.get<Response<MainbookType[]>>(`${ApiEndpoints.mainbook}/type`)
  return res.data
}
