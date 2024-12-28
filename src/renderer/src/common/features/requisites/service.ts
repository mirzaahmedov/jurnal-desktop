import type { QueryFunctionContext } from '@tanstack/react-query'
import type { Response } from '@/common/models'
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

  const res = await http.get<Response<MainSchetOptionType[]>>(
    `/spravochnik/main-schet/budjet/region`,
    {
      params: {
        budjet_id,
        region_id
      },
      withCredentials: false
    }
  )
  return res.data
}
