import type { AdminOrgan159 } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@/common/lib/http'

export class AdminOrgan159Service {
  static QueryKeys = {
    GetAll: '/admin/jur3-159'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<[typeof AdminOrgan159Service.QueryKeys.GetAll, { to: string }]>
  ) {
    const params = ctx.queryKey[1]
    const res = await http.get<ApiResponse<AdminOrgan159[]>>('/admin/jur3-159', {
      params
    })
    return res.data
  }
}
