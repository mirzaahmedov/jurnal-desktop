import type { Response } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@/common/features/crud'
import { http } from '@/common/lib/http'

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
  prixod: number
  rasxod: number
  sub_childs: Array<MainbookAutoFillSubChild>
}
export interface AutoFillMainbookArgs {
  month: number
  year: number
  budjet_id: number
}
export const autoFillMainbookData = async ({ year, month, budjet_id }: AutoFillMainbookArgs) => {
  const res = await http.get<Response<MainbookAutoFill[]>>(`${ApiEndpoints.mainbook}/data`, {
    params: {
      year,
      month,
      budjet_id
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
export interface GetMainbookTypeArgs {
  budjet_id?: number
}
export const getMainbookTypes = async (
  ctx: QueryFunctionContext<[string, GetMainbookTypeArgs]>
) => {
  const { budjet_id } = ctx.queryKey[1]
  const res = await http.get<Response<MainbookType[]>>(`${ApiEndpoints.mainbook}/type`, {
    params: {
      budjet_id
    }
  })
  return res.data
}
