import type { AdminKassa } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/common/lib/http'

interface AdminKassaMeta {
  summa_from: number
  summa_to: number
  prixod: number
  rasxod: number
  total: number
}

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
    const res = await api.get<ApiResponse<AdminKassa[], AdminKassaMeta>>('/admin/jur1', {
      params
    })
    return res.data
  }
}
