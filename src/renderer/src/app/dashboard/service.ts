import type { Dashboard } from './model'
import type { PaginationParams } from '@/common/hooks'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/common/lib/http'

export const getDashboardBudjetOptionsQuery = async () => {
  const res = await api.get<ApiResponse<Dashboard.Budjet[]>>('dashboard/budjet')
  return res.data
}

interface DashboardCommonParams {
  budjet_id: number
  to: string
}

export const getDashboardKassaQuery = async (
  ctx: QueryFunctionContext<[string, DashboardCommonParams]>
) => {
  const { to, budjet_id } = ctx.queryKey[1]
  const res = await api.get<ApiResponse<Dashboard.Kassa[]>>('dashboard/kassa', {
    params: {
      budjet_id,
      to
    }
  })
  return res.data?.data?.[0]?.main_schets
}

export const getDashboardBankQuery = async (
  ctx: QueryFunctionContext<[string, DashboardCommonParams]>
) => {
  const { to, budjet_id } = ctx.queryKey[1]
  const res = await api.get<ApiResponse<Dashboard.Bank[]>>('dashboard/bank', {
    params: {
      budjet_id,
      to
    }
  })
  return res.data?.data?.[0]?.main_schets
}

export const getDashboardPodotchetQuery = async (
  ctx: QueryFunctionContext<[string, DashboardCommonParams & PaginationParams]>
) => {
  const { to, budjet_id, page, limit } = ctx.queryKey[1]
  const res = await api.get<ApiResponse<Dashboard.Podotchet[]>>('dashboard/podotchet', {
    params: {
      budjet_id,
      to,
      page,
      limit
    }
  })
  return res.data
}
