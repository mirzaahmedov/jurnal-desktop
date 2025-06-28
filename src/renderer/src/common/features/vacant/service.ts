import type { VacantFormValues } from './config'
import type { Vacant } from '@/common/models/vacant'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { type Response, zarplataApiNew } from '@/common/lib/zarplata_new'

export class VacantService {
  static endpoint = 'Vacant'

  static QueryKeys = {
    GetAll: 'vacant/all',
    GetById: 'vacant/id'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof VacantService.QueryKeys.GetAll, { page?: number; limit?: number }]
    >
  ) {
    const res = await zarplataApiNew.get<Response<Vacant[]>>(`${VacantService.endpoint}`, {
      params: ctx.queryKey[1]
    })
    return res.data
  }
  static async create(values: VacantFormValues): Promise<VacantFormValues> {
    const res = await zarplataApiNew.post<VacantFormValues>(`${VacantService.endpoint}`, values)
    return res.data
  }
  static async update(args: { id: number; values: VacantFormValues }): Promise<VacantFormValues> {
    const { id, values } = args
    const res = await zarplataApiNew.put<VacantFormValues>(
      `${VacantService.endpoint}/${id}`,
      values
    )
    return res.data
  }
  static async delete(id: number) {
    const res = await zarplataApiNew.delete<VacantFormValues>(`${VacantService.endpoint}/${id}`)
    return res.data
  }
}
