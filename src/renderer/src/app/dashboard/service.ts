import type { Dashboard } from './model'
import type { Response } from '@renderer/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@renderer/common/lib/http'

export const getDashboardBudjetOptionsQuery = async () => {
  const res = await http.get<Response<Dashboard.Budjet[]>>('dashboard/budjet')
  return res.data
}

interface GetDashboardKassaQueryParams {
  budjet_id: number
  to: string
}
export const getDashboardKassaQuery = async (
  ctx: QueryFunctionContext<[string, GetDashboardKassaQueryParams]>
) => {
  const { to, budjet_id } = ctx.queryKey[1]
  const res = await http.get<Response<Dashboard.Kassa[]>>('dashboard/kassa', {
    params: {
      budjet_id,
      to
    }
  })
  return res.data
}

interface GetDashboardKassaQueryParams {
  budjet_id: number
  to: string
}
export const getDashboardBankQuery = async (
  ctx: QueryFunctionContext<[string, GetDashboardKassaQueryParams]>
) => {
  const { to, budjet_id } = ctx.queryKey[1]
  const res = await http.get<Response<Dashboard.Bank[]>>('dashboard/bank', {
    params: {
      budjet_id,
      to
    }
  })
  return res.data
}
