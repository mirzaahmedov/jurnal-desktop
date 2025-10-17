import type { AdminOrgan152 } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/common/lib/http'

interface AdminOrgan152Meta {
  summa_from: number
  summa_to: number
  prixod: number
  rasxod: number
  total: number
}

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
    const res = await api.get<ApiResponse<AdminOrgan152[], AdminOrgan152Meta>>('/admin/jur3-152', {
      params
    })
    return res.data
  }
}
