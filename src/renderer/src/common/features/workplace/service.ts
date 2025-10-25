import type { WorkplaceFormValues } from './config'
import type { PaginationParams } from '@/common/hooks'
import type { ApiResponse } from '@/common/models'
import type { Workplace } from '@/common/models/workplace'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { getMultiApiResponse, getSingleApiResponse } from '@/common/lib/zarplata'
import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata'

export class WorkplaceService {
  static endpoint = 'Workplace'

  static QueryKeys = {
    GetAll: 'workplace/all',
    GetById: 'workplace/id',
    GetByVacantId: 'workplace/vacant-id'
  }

  static async getWorkplaces(
    ctx: QueryFunctionContext<
      [
        typeof WorkplaceService.QueryKeys.GetAll,
        PaginationParams & {
          vacantId: number
          search?: string
          orderBy?: string
          orderType?: 'asc' | 'desc'
        }
      ]
    >
  ): Promise<ApiResponse<Workplace[]>> {
    const params = ctx.queryKey[1] ?? {}
    const res = await zarplataApiNew.get<ZarplataApiResponse<Workplace[]>>(
      `${WorkplaceService.endpoint}`,
      {
        params: {
          ...params,
          PageIndex: params.page,
          PageSize: params.limit
        }
      }
    )
    return getMultiApiResponse({
      response: res.data,
      page: params?.page,
      limit: params?.limit
    })
  }

  static async getWorkplaceById(
    ctx: QueryFunctionContext<[typeof WorkplaceService.QueryKeys.GetById, number]>
  ): Promise<ApiResponse<Workplace>> {
    const id = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<Workplace>>(
      `${WorkplaceService.endpoint}/${id}`
    )
    return getSingleApiResponse({
      response: res.data?.data
    })
  }

  static async createWorkplace(values: WorkplaceFormValues) {
    const res = await zarplataApiNew.post<WorkplaceFormValues>(
      `${WorkplaceService.endpoint}`,
      values
    )
    return res.data
  }

  static async updateWorkplace(args: { id: number; values: WorkplaceFormValues }) {
    const { id, values } = args
    const res = await zarplataApiNew.put<WorkplaceFormValues>(
      `${WorkplaceService.endpoint}/${id}`,
      values
    )
    return res.data
  }
  static async deleteWorkplace(id: number) {
    const res = await zarplataApiNew.delete<WorkplaceFormValues>(
      `${WorkplaceService.endpoint}/${id}`
    )
    return res.data
  }

  static async dismissEmployee(id: number) {
    const res = await zarplataApiNew.put<void>(`${WorkplaceService.endpoint}/dismiss`, undefined, {
      params: {
        id
      }
    })
    return res.data
  }
}
