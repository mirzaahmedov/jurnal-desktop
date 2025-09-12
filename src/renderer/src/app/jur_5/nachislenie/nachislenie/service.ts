import type { NachislenieFormValues } from './config'
import type { Nachislenie, NachislenieProvodka } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { getMultiApiResponse } from '@/common/lib/zarplata'
import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

export class NachislenieService {
  static endpoint = 'Nachislenie'

  static QueryKeys = {
    GetAll: 'nachislenie/all',
    MadeVacants: 'nachislenie/made-vacants',
    GetById: 'nachislenie/:id',
    GetMainById: 'nachislenie/:mainId',
    GetChildById: 'nachislenie/get-by-child-id',
    GetVacantId: 'nachislenie/:vacantId'
  }

  static async getMainById(
    ctx: QueryFunctionContext<[typeof NachislenieService.QueryKeys.GetById, number]>
  ) {
    const mainId = ctx.queryKey[1]
    const res = await zarplataApiNew.get<NachislenieProvodka[]>(
      `${NachislenieService.endpoint}/get-main/${mainId}`
    )
    return res.data
  }

  static async getById(
    ctx: QueryFunctionContext<
      [
        typeof NachislenieService.QueryKeys.GetById,
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
      `${NachislenieService.endpoint}/${id}`,
      {
        params
      }
    )
    return res.data
  }

  static async getMaxDocNum() {
    const res = await zarplataApiNew.get<number>(`${NachislenieService.endpoint}/get-max-docNum`)
    return res.data
  }

  static async getVacantsMade(
    ctx: QueryFunctionContext<
      [
        typeof NachislenieService.QueryKeys.MadeVacants,
        {
          year: number
          month: number
          budjetId: number
        }
      ]
    >
  ) {
    const { year, month, budjetId } = ctx.queryKey[1]
    const res = await zarplataApiNew.get<{ vacantId: number[] }>(
      `${NachislenieService.endpoint}/made-vacants`,
      {
        params: {
          year,
          month,
          budjet_name_id: budjetId
        }
      }
    )
    return res.data
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        typeof NachislenieService.QueryKeys.GetVacantId,
        {
          page: number
          limit: number
          year?: number
          month?: number
          doc_num?: string
          budjet_name_id: number
          vacantId: number
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<Nachislenie[]>>(
      `${NachislenieService.endpoint}`,
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

  static async updateChild(
    childId: number,
    values: {
      id: number
      mainZarplataId: number
      fio: string
      doljnost: string
      rabDni: number
      otrabDni: number
      noch: number
      prazdnik: number
      pererabodka: number
      kazarma: number
    }
  ) {
    const res = await zarplataApiNew.put<ZarplataApiResponse<Nachislenie[]>>(
      `${NachislenieService.endpoint}/update-child/${childId}`,
      values
    )
    return res.data
  }

  static async create(values: NachislenieFormValues) {
    const res = await zarplataApiNew.post<ZarplataApiResponse<Nachislenie[]>>(
      `${NachislenieService.endpoint}`,
      values
    )
    return res.data
  }

  static async update(args: { id: number; values: NachislenieFormValues }) {
    const res = await zarplataApiNew.put<ZarplataApiResponse<Nachislenie[]>>(
      `${NachislenieService.endpoint}/${args.id}`,
      args.values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete<ZarplataApiResponse<Nachislenie[]>>(
      `${NachislenieService.endpoint}/${id}`
    )
    return res.data
  }

  static async getChildById(childId: number) {
    const res = await zarplataApiNew.get<NachislenieProvodka>(
      `${NachislenieService.endpoint}/getByChildId/${childId}`
    )
    return res.data
  }
}
