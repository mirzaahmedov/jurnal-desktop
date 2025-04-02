import type { Response } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@/common/features/crud'
import { http } from '@/common/lib/http'

export interface PrixodbookAutoFillSubChild {
  schet: string
  prixod: number
  rasxod: number
}
export interface PrixodbookAutoFill {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
  prixod: number
  rasxod: number
  sub_childs: Array<PrixodbookAutoFillSubChild>
}
export interface AutoFillPrixodbookArgs {
  month: number
  year: number
  budjet_id: number
}
export const autoFillPrixodbookData = async ({
  year,
  month,
  budjet_id
}: AutoFillPrixodbookArgs) => {
  const res = await http.get<Response<PrixodbookAutoFill[]>>(`${ApiEndpoints.prixodbook}/data`, {
    params: {
      year,
      month,
      budjet_id
    }
  })
  return res.data
}

export interface PrixodbookType {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
}
export interface GetPrixodbookTypeArgs {
  budjet_id?: number
}
export const getPrixodbookTypes = async (
  ctx: QueryFunctionContext<[string, GetPrixodbookTypeArgs]>
) => {
  const { budjet_id } = ctx.queryKey[1]
  const res = await http.get<Response<PrixodbookType[]>>(`${ApiEndpoints.prixodbook}/type`, {
    params: {
      budjet_id
    }
  })
  return res.data
}
