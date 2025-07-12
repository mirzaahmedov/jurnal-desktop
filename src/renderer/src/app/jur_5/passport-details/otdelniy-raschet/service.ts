import type { ApiResponse } from '@/common/models'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'
import type { OtdelniyRaschetFormValues } from './config'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@/common/features/crud'
import { http } from '@/common/lib/http'

export class OtdelniyRaschetService {
  static endpoint = ApiEndpoints.zarplata_otdelniy_raschet

  static QueryKeys = {
    GetAll: 'OtdelniyRaschet/all'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof OtdelniyRaschetService.QueryKeys.GetAll, { page: number; limit: number }]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await http.get<ApiResponse<OtdelniyRaschet[]>>(OtdelniyRaschetService.endpoint, {
      params
    })
    return res.data
  }

  static async create(values: OtdelniyRaschetFormValues) {
    const res = await http.post<OtdelniyRaschet>(
      OtdelniyRaschetService.endpoint,
      values
    )
    return res.data
  }
  static async update(args: {
    id: number;
    values: OtdelniyRaschetFormValues;
  }) {
    const { id, values } = args
    const res = await http.put<OtdelniyRaschet>(
      `${OtdelniyRaschetService.endpoint}/${id}`,
      values
    )
    return res.data
  }
  static async delete(id: number) {
    const res = await http.delete<OtdelniyRaschet>(
      `${OtdelniyRaschetService.endpoint}/${id}`
    )
    return res.data
  }
}
