import type { DopOplataFormValues } from './config'
import type { DopOplata } from '@/common/models/dop-oplata'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApiNew } from '@/common/lib/zarplata_new'

export class DopOplataService {
  static endpoint = 'AdditionalPaymenyt'

  static QueryKeys = {
    GetByMainZarplataId: 'AdditionalPaymenyt/get-by-mainId'
  }

  static async getAll(
    ctx: QueryFunctionContext<[typeof DopOplataService.QueryKeys.GetByMainZarplataId, number]>
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const res = await zarplataApiNew.get<DopOplata[]>(
      `${DopOplataService.endpoint}/get-by-mainId/${mainZarplataId}`
    )
    return res.data
  }

  static async create(values: DopOplataFormValues) {
    const res = await zarplataApiNew.post(`${DopOplataService.endpoint}`, values)
    return res.data
  }

  static async update(args: { id: number; values: DopOplataFormValues }) {
    const res = await zarplataApiNew.put(`${DopOplataService.endpoint}/${args.id}`, args.values)
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete(`${DopOplataService.endpoint}/${id}`)
    return res.data
  }
}
