import type { AdminBank } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@/common/lib/http'

export class AdminBankService {
  static QueryKeys = {
    GetAll: '/admin/jur2'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<[typeof AdminBankService.QueryKeys.GetAll, { to: string }]>
  ) {
    const params = ctx.queryKey[1]
    const res = await http.get<ApiResponse<AdminBank[]>>('/admin/jur2', {
      params
    })
    return res.data
  }
}
