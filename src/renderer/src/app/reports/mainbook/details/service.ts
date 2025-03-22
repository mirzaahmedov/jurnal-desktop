import type { Response } from '@renderer/common/models'

import { ApiEndpoints } from '@renderer/common/features/crud'
import { getBudjetId } from '@renderer/common/features/requisites'
import { http } from '@renderer/common/lib/http'

export interface MainbookAutoFillSubChild {
  schet: string
  prixod: number
  rasxod: number
}
export interface MainbookAutoFill {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
  sub_childs: Array<MainbookAutoFillSubChild>
}
export interface AutoFillMainbookArgs {
  month: number
  year: number
}
export const autoFillMainbookData = async ({ year, month }: AutoFillMainbookArgs) => {
  const res = await http.get<Response<MainbookAutoFill[]>>(`${ApiEndpoints.mainbook}/data`, {
    params: {
      year,
      month,
      budjet_id: getBudjetId()
    }
  })
  return res.data
}

export interface MainbookType {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
}
export const getMainbookTypes = async () => {
  const res = await http.get<Response<MainbookType[]>>(`${ApiEndpoints.mainbook}/type`, {
    params: {
      budjet_id: getBudjetId()
    }
  })
  return res.data
}
