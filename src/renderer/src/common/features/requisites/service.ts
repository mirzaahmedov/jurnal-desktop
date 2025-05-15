import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@/common/lib/http'

export type MainSchetOptionType = {
  main_schet_id: number
  account_number: string
}

export type QueryKeyType = [
  string,
  {
    budjet_id: number
    region_id: number
  }
]
export const getMainSchetsQuery = async (ctx: QueryFunctionContext<QueryKeyType>) => {
  const { budjet_id, region_id } = ctx.queryKey[1]

  const res = await http.get<ApiResponse<MainSchetOptionType[]>>(
    `/spravochnik/main-schet/budjet/region`,
    {
      params: {
        budjet_id,
        region_id
      }
    }
  )
  return res.data
}

export interface DuplicateSchet {
  jur1_schet: string
  count: number
}

export const checkSchetsDuplicateQuery = async (
  ctx: QueryFunctionContext<[string, { budjet_id: number }]>
) => {
  const { budjet_id } = ctx.queryKey[1]
  const res = await http.get<ApiResponse<DuplicateSchet[]>>('/features/check/schets', {
    params: {
      budjet_id
    }
  })
  return res.data
}
