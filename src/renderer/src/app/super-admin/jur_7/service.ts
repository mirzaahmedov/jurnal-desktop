import type { AdminMaterial } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'
import { http } from '@/common/lib/http'

export class AdminMaterialService {
  static QueryKeys = {
    GetAll: '/admin/jur7'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof AdminMaterialService.QueryKeys.GetAll, { to: string; search?: string }]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await http.get<ApiResponse<AdminMaterial[]>>('/admin/jur7', {
      params
    })
    return res.data
  }
}
