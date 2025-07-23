import type { NachislenieFormValues } from './config'
import type { Nachislenie, NachislenieDetails, NachislenieSostav } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

import { getMockingNachislenieSostav } from './mocking'

export class NachislenieService {
  static endpoint = 'Nachislenie'

  static QueryKeys = {
    GetAll: 'nachislenie/all',
    GetById: 'nachislenie/:id',
    GetByVacantId: 'nachislenie/vacantId'
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
    const res = await zarplataApiNew.get<NachislenieDetails[]>(
      `${NachislenieService.endpoint}/${id}`,
      {
        params
      }
    )
    return res.data
  }

  static async getByVacantId(
    ctx: QueryFunctionContext<
      [
        typeof NachislenieService.QueryKeys.GetByVacantId,
        {
          page: number
          limit: number
          vacantId: number
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get<Nachislenie[]>(`${NachislenieService.endpoint}`, {
      params
    })
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
}

export class NachislenieSostavService {
  static endpoint = 'NachislenieSostav'

  static QueryKeys = {
    GetAll: 'nachislenie-sostav/all',
    GetByVacantId: 'nachislenie-sostav/vacantId'
  }

  static async getByVacantId() {
    return new Promise<{
      data: NachislenieSostav[]
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          data: getMockingNachislenieSostav()
        })
      }, 1000)
    })
  }
}
