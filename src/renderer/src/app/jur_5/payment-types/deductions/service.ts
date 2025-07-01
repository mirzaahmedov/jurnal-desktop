import type { DeductionFormValues } from './config'
import type { Deduction } from '@/common/models/deduction'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@/common/features/crud'
import { getMultiApiResponse, getSingleApiResponse } from '@/common/lib/zarplata'
import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

export class DeductionsService {
  static endpoint = ApiEndpoints.zarplata_deductions
  static client = zarplataApiNew

  static QueryKeys = {
    GetAll: 'deductions/getAll',
    GetById: 'deductions/id/',
    Update: 'deductions/update'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof DeductionsService.QueryKeys.GetAll, { page: number; limit: number }]
    >
  ) {
    const { page, limit } = ctx.queryKey[1]
    const res = await DeductionsService.client.get<ZarplataApiResponse<Deduction[]>>(
      DeductionsService.endpoint,
      {
        params: {
          PageIndex: page,
          PageSize: limit
        }
      }
    )
    return getMultiApiResponse({
      response: res.data,
      page,
      limit
    })
  }
  static async getById(
    ctx: QueryFunctionContext<[typeof DeductionsService.QueryKeys.GetById, number]>
  ) {
    const id = ctx.queryKey[1]
    const res = await DeductionsService.client.get<Deduction>(`${DeductionsService.endpoint}/${id}`)
    return getSingleApiResponse({
      response: res.data
    })
  }

  static async create(values: DeductionFormValues) {
    const res = await DeductionsService.client.post<Deduction>(DeductionsService.endpoint, values)
    return res.data
  }

  static async update(values: DeductionFormValues) {
    const res = await DeductionsService.client.put<Deduction>(
      `${DeductionsService.endpoint}/${values.id}`,
      values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await DeductionsService.client.delete<Deduction>(
      `${DeductionsService.endpoint}/${id}`
    )
    return res.data
  }
}
