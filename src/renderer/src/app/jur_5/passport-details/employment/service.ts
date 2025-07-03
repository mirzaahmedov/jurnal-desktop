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
    const res = await zarplataApiNew.get(
      `${EmploymentService.endpoint}/get-by-mainID/${mainZarplataId}`
    )
    return res.data
  }
}
