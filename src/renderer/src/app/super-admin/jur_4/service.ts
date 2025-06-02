import type { AdminPodotchet } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@/common/lib/http'

export class AdminPodotchetService {
  static QueryKeys = {
    GetAll: '/admin/jur4'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<[typeof AdminPodotchetService.QueryKeys.GetAll, { to: string }]>
  ) {
    const params = ctx.queryKey[1]
    const res = await http.get<ApiResponse<AdminPodotchet[]>>('/admin/jur4', {
      params
    })
    return res.data
  }
}
