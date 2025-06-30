import type { WorkplaceFormValues } from './config'
import type { PaginationParams } from '@/common/hooks'
import type { Workplace } from '@/common/models/workplace'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { type Response, zarplataApiNew } from '@/common/lib/zarplata_new'

export class WorkplaceService {
  static endpoint = 'Workplace'

  static QueryKeys = {
    GetAll: 'workplace/all',
    GetById: 'workplace/id',
    GetByVacantId: 'workplace/vacant-id'
  }

  static async getWorkplaces(
    ctx: QueryFunctionContext<
      [typeof WorkplaceService.QueryKeys.GetAll, PaginationParams & { vacantId: number }]
    >
  ): Promise<Response<Workplace[]>> {
    const params = ctx.queryKey[1] ?? {}
    const res = await zarplataApiNew.get<Response<Workplace[]>>(`${WorkplaceService.endpoint}`, {
      params
    })
    return res.data
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
}
