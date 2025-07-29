import type { NachislenieOthersFormValues } from './config'
import type { Nachislenie, NachislenieOthers, NachislenieProvodka } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { getMultiApiResponse } from '@/common/lib/zarplata'
import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

export class NachislenieOthersService {
  static endpoint = 'NachislenieOthers'

  static QueryKeys = {
    GetAll: 'nachislenie_others/all',
    GetById: 'nachislenie_others/:id',
    GetByVacantId: 'nachislenie_others/vacantId'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        typeof NachislenieOthersService.QueryKeys.GetAll,
        {
          page: number
          limit: number
          year?: number
          month?: number
          doc_num?: string
          budjet_name_id: number
          type?: string
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<NachislenieOthers[]>>(
      `${NachislenieOthersService.endpoint}`,
      {
        params
      }
    )
    return getMultiApiResponse({
      response: res.data,
      page: params.page,
      limit: params.limit
    })
  }

  static async getById(
    ctx: QueryFunctionContext<
      [
        typeof NachislenieOthersService.QueryKeys.GetById,
        number,
        {
          vacantId?: number
        }
      ]
    >
  ) {
    const id = ctx.queryKey[1]
    const params = ctx.queryKey[2] || {}
    const res = await zarplataApiNew.get<NachislenieProvodka[]>(
      `${NachislenieOthersService.endpoint}/${id}`,
      {
        params
      }
    )
    return res.data
  }

  static async getMaxDocNum() {
    const res = await zarplataApiNew.get<number>(
      `${NachislenieOthersService.endpoint}/get-max-docNum`
    )
    return res.data
  }

  static async create(values: NachislenieOthersFormValues) {
    const res = await zarplataApiNew.post<ZarplataApiResponse<Nachislenie[]>>(
      `${NachislenieOthersService.endpoint}`,
      values
    )
    return res.data
  }

  static async update(args: { id: number; values: NachislenieOthersFormValues }) {
    const res = await zarplataApiNew.put<ZarplataApiResponse<Nachislenie[]>>(
      `${NachislenieOthersService.endpoint}/${args.id}`,
      args.values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete<ZarplataApiResponse<Nachislenie[]>>(
      `${NachislenieOthersService.endpoint}/${id}`
    )
    return res.data
  }
}
