import type { AdminDashboardRegion } from './model'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@/common/lib/http'

export const getDashboardBudjetOptionsQuery = async () => {
  const res = await http.get<ApiResponse<any[]>>('admin/dashboard/budjet')
  return res.data
}

interface DashboardCommonParams {
  to: string
  region_id: number
  budjet_id: number
}

export const getDashboardKassaQuery = async (
  ctx: QueryFunctionContext<[string, DashboardCommonParams]>
) => {
  const { to } = ctx.queryKey[1]
  const res = await http.get<ApiResponse<any[]>>('admin/dashboard/kassa', {
    params: {
      to
    }
  })
  return res.data?.data?.[0]?.main_schets
}

export const getDashboardBankQuery = async (
  ctx: QueryFunctionContext<[string, DashboardCommonParams]>
) => {
  const { to } = ctx.queryKey[1]
  const res = await http.get<ApiResponse<any[]>>('admin/dashboard/bank', {
    params: {
      to
    }
  })
  return res.data?.data?.[0]?.main_schets
}

export class AdminDashboardService {
  static endpoint = 'admin/dashboard'

  static QueryKeys = {
    Kassa: 'admin/dashboard/kassa',
    Podotchets: 'admin/dashboard/podotchet'
  }

  static async getKassa(ctx: QueryFunctionContext<[string, DashboardCommonParams]>) {
    const { to } = ctx.queryKey[1]
    const res = await http.get<ApiResponse<any[]>>(`${AdminDashboardService.endpoint}/kassa`, {
      params: {
        to
      }
    })
    return res.data?.data?.[0]?.main_schets
  }

  static async getPodotchets(
    ctx: QueryFunctionContext<
      [
        string,
        {
          to: string
          region_id?: number
          budjet_id?: number
        }
      ]
    >
  ) {
    const { to, region_id, budjet_id } = ctx.queryKey[1]
    const res = await http.get<ApiResponse<AdminDashboardRegion[]>>(
      `${AdminDashboardService.endpoint}/podotchet`,
      {
        params: {
          to,
          region_id,
          budjet_id
        }
      }
    )
    return res.data
  }
}
