import type { DopOplata } from '@/common/models/dop-oplata'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

export class DopOplataService {
  static endpoint = 'DopOplata'

  static QueryKeys = {
    GetByMainZarplataId: 'DopOplata/get-by-mainId'
  }

  static async getByMainZarplataId(
    ctx: QueryFunctionContext<[typeof DopOplataService.QueryKeys.GetByMainZarplataId, number]>
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<DopOplata[]>>(
      `${this.endpoint}/get-by-mainId/${mainZarplataId}`
    )
    return res.data
  }

  static async create(values: any) {
    const res = await zarplataApiNew.post(`${this.endpoint}`, values)
    return res.data
  }

  static async update(id: number, values: any) {
    const res = await zarplataApiNew.put(`${this.endpoint}/${id}`, values)
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete(`${this.endpoint}/${id}`)
    return res.data
  }
}
