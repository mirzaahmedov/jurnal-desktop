import type { NachislenieFormValues } from './config'
import type { Nachislenie, NachislenieSostav } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

import { getMockingNachislenieSostav } from './mocking'

export class NachislenieService {
  static endpoint = 'Nachislenie'

  static QueryKeys = {
    GetAll: 'nachislenie/all',
    GetByVacantId: 'nachislenie/vacantId'
  }

  static async getByVacantId(
    ctx: QueryFunctionContext<
      [
        typeof NachislenieService.QueryKeys.GetByVacantId,
        {
          page: number
          limit: number
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
