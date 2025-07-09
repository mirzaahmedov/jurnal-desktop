import type { EmploymentFormValues } from './config'
import type { Employment } from '@/common/models/employment'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApiNew } from '@/common/lib/zarplata_new'

export class EmploymentService {
  static endpoint = 'Trudovoy'

  static QueryKeys = {
    getByMainZarplataId: 'Trudovoy/get-by-id'
  }

  static async getByMainZarplataId(
    ctx: QueryFunctionContext<[typeof EmploymentService.QueryKeys.getByMainZarplataId, number]>
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const res = await zarplataApiNew.get<Employment[]>(
      `${EmploymentService.endpoint}/get-by-mainID/${mainZarplataId}`
    )
    return res.data
  }

  static async create(values: EmploymentFormValues) {
    const res = await zarplataApiNew.post<Employment>(`${EmploymentService.endpoint}`, values)
    return res.data
  }

  static async update(args: { values: EmploymentFormValues; id: number }) {
    const res = await zarplataApiNew.put<Employment>(
      `${EmploymentService.endpoint}/${args.id}`,
      args.values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete(`${EmploymentService.endpoint}/${id}`)
    return res.data
  }
}
