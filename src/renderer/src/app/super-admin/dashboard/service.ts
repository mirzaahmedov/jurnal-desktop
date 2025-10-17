import type { AdminDashboardBank, AdminDashboardKassa, AdminDashboardPodotchet } from './model'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/common/lib/http'

interface DashboardCommonParams {
  to: string
  region_id: number | undefined
  budjet_id: number | undefined
}

export class AdminDashboardService {
  static endpoint = 'admin/dashboard'

  static QueryKeys = {
    Kassa: 'admin/dashboard/kassa',
    Bank: 'admin/dashboard/bank',
    Podotchets: 'admin/dashboard/podotchet'
  }

  static async getKassa(ctx: QueryFunctionContext<[string, DashboardCommonParams]>) {
    const { to } = ctx.queryKey[1]
    const res = await api.get<ApiResponse<AdminDashboardKassa[]>>(
      `${AdminDashboardService.endpoint}/kassa`,
      {
        params: {
          to
        }
      }
    )
    return res.data?.data
  }

  static async getBank(ctx: QueryFunctionContext<[string, DashboardCommonParams]>) {
    const { to } = ctx.queryKey[1]
    const res = await api.get<ApiResponse<AdminDashboardBank[]>>(
      `${AdminDashboardService.endpoint}/bank`,
      {
        params: {
          to
        }
      }
    )
    return res.data?.data
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
    const res = await api.get<ApiResponse<AdminDashboardPodotchet[]>>(
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
