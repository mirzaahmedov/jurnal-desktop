import type { AdminOrgan152 } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@/common/lib/http'

export class AdminOrgan152Service {
  static QueryKeys = {
    GetAll: '/admin/jur3-152'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof AdminOrgan152Service.QueryKeys.GetAll, { to: string; search?: string }]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await http.get<ApiResponse<AdminOrgan152[]>>('/admin/jur3-152', {
      params
    })
    return res.data
  }
}
