import type { Vacant } from '@renderer/common/models/vacant'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApi } from '@renderer/app/super-admin/zarplata/common/api'

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
  const res = await zarplataApi.get<{
    totalCount: number
    data: Vacant[]
  }>('Vacant', {
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
  const res = await zarplataApi.get<number[]>(`Vacant/vacants/${userId}`)
  return res.data
}

export interface CreateVacantGrantArgs {
  ids: number[]
  userId: number
}
export const createVacantGrantQuery = async ({ ids, userId }: CreateVacantGrantArgs) => {
  const res = await zarplataApi.post<{
    totalCount: number
    data: Vacant[]
  }>('Vacant/grant', ids, {
    params: {
      userId
    }
  })
  return res.data
}
