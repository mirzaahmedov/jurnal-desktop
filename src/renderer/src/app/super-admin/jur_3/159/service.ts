import type { AdminOrgan159 } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/common/lib/http'

interface AdminOrgan159Meta {
  summa_from: number
  summa_to: number
  prixod: number
  rasxod: number
  total: number
}

export class AdminOrgan159Service {
  static QueryKeys = {
    GetAll: '/admin/jur3-159'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof AdminOrgan159Service.QueryKeys.GetAll, { to: string; search?: string }]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await api.get<ApiResponse<AdminOrgan159[], AdminOrgan159Meta>>('/admin/jur3-159', {
      params
    })
    return res.data
  }
}
