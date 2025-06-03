import type { AdminKassa } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@/common/lib/http'

export class AdminKassaService {
  static QueryKeys = {
    GetAll: '/admin/jur1'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof AdminKassaService.QueryKeys.GetAll, { to: string; search?: string }]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await http.get<ApiResponse<AdminKassa[]>>('/admin/jur1', {
      params
    })
    return res.data
  }
}
