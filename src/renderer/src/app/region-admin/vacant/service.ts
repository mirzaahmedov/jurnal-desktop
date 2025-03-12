import type { Vacant } from '@renderer/common/models/vacant'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@renderer/common/lib/http'

export const getVacantListQuery = async (
  ctx: QueryFunctionContext<
    [
      string,
      {
        userId: number
      }
    ]
  >
) => {
  const { userId } = ctx.queryKey[1]
  const res = await http.get<{
    totalCount: number
    data: Vacant[]
  }>('http://147.45.107.174:5001/api/Vacant', {
    params: {
      PageIndex: 1,
      PageSize: 10000000,
      userId
    }
  })
  return res.data
}

export const getUserVacantIdsQuery = async (
  ctx: QueryFunctionContext<
    [
      string,
      {
        userId: number
      }
    ]
  >
) => {
  const { userId } = ctx.queryKey[1]
  const res = await http.get<number[]>(`http://147.45.107.174:5001/api/Vacant/vacants/${userId}`)
  return res.data
}

export interface CreateVacantGrantArgs {
  ids: number[]
  userId: number
}
export const createVacantGrantQuery = async ({ ids, userId }: CreateVacantGrantArgs) => {
  const res = await http.post<{
    totalCount: number
    data: Vacant[]
  }>('http://147.45.107.174:5001/api/Vacant/grant', ids, {
    params: {
      userId
    }
  })
  return res.data
}
