import type { AdminBank } from './interfaces'
import type { ApiResponse } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/common/lib/http'

interface AdminBankMeta {
  summa_from: number
  summa_to: number
  prixod: number
  rasxod: number
  total: number
}

export class AdminBankService {
  static QueryKeys = {
    GetAll: '/admin/jur2'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof AdminBankService.QueryKeys.GetAll, { to: string; search?: string }]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await api.get<ApiResponse<AdminBank[], AdminBankMeta>>('/admin/jur2', {
      params
    })
    return res.data
  }
}
