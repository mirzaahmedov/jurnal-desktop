import type { TabelFormValues } from './config'
import type { ZarplataApiResponse } from '@/common/lib/zarplata_new'
import type { Tabel, TabelProvodka } from '@/common/models/tabel'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { getMultiApiResponse } from '@/common/lib/zarplata'
import { zarplataApiNew } from '@/common/lib/zarplata_new'

export class TabelService {
  static endpoint = 'Tabel'

  static QueryKeys = {
    GetAll: 'Tabel/all',
    GetById: 'Tabel/:id'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        typeof TabelService.QueryKeys.GetAll,
        {
          page: number
          limit: number
          docNum?: string
          year?: number
          month?: number
          budjetId?: number
          vacantId?: number
          status?: boolean
        }
      ]
    >
  ) {
    const { page, limit, docNum, year, month, budjetId, status, vacantId } = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<Tabel[]>>(`${TabelService.endpoint}`, {
      params: {
        PageIndex: page,
        PageSize: limit,
        docNum,
        year,
        month,
        budjet_name_id: budjetId,
        status,
        vacantId
      }
    })
    return getMultiApiResponse({
      page,
      limit,
      response: res.data
    })
  }

  static async getById(
    ctx: QueryFunctionContext<
      [typeof TabelService.QueryKeys.GetById, number, { vacantId?: number }]
    >
  ) {
    const id = ctx.queryKey[1]
    const vacantId = ctx.queryKey[2]?.vacantId
    const res = await zarplataApiNew.get<
      Array<{
        id: number
        vacantId: number
        vacantName: string
        children: TabelProvodka[]
      }>
    >(`${TabelService.endpoint}/${id}`, {
      params: {
        vacantId
      }
    })
    return res.data
  }

  static async getMaxDocNum() {
    const res = await zarplataApiNew.get<number>(`${TabelService.endpoint}/get-max-docNum`)
    return res.data
  }

  static async create(values: TabelFormValues) {
    const res = await zarplataApiNew.post<ZarplataApiResponse<Tabel>>(
      `${TabelService.endpoint}`,
      values
    )
    return res.data
  }

  static async updateChild(args: { id: number; values: TabelProvodka }) {
    const res = await zarplataApiNew.put<ZarplataApiResponse<Tabel>>(
      `${TabelService.endpoint}/tabel-child/${args.id}`,
      args.values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete<ZarplataApiResponse<void>>(
      `${TabelService.endpoint}/${id}`
    )
    return res.data
  }
}
