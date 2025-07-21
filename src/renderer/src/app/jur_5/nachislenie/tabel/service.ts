import type { TabelFormValues, TabelProvodkaFormValues } from './config'
import type { ZarplataApiResponse } from '@/common/lib/zarplata_new'
import type { Tabel } from '@/common/models/tabel'
import type { QueryFunctionContext } from '@tanstack/react-query'

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
          status?: boolean
        }
      ]
    >
  ) {
    const { page, limit, docNum, year, month, budjetId, status } = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<Tabel[]>>(`${TabelService.endpoint}`, {
      params: {
        PageIndex: page,
        PageSize: limit,
        docNum,
        year,
        month,
        budjet_name_id: budjetId,
        status
      }
    })
    return res.data
  }

  static async getById(ctx: QueryFunctionContext<[typeof TabelService.QueryKeys.GetById, number]>) {
    const id = ctx.queryKey[1]
    const res = await zarplataApiNew.get<[Tabel]>(`${TabelService.endpoint}/${id}`)
    return res.data?.[0]
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

  static async updateChild(args: { id: number; values: TabelProvodkaFormValues }) {
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
