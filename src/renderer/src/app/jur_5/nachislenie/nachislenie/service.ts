import type { Nachislenie, NachislenieSostav } from '@/common/models'

import { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApiNew } from '@/common/lib/zarplata_new'

import { getMockingNachislenie, getMockingNachislenieSostav } from './mocking'

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
          vacantId: number
          page: number
          limit: number
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get(`${this.endpoint}`, { params })
    return res.data
  }

  static async delete(id: number) {
    console.log(`Deleting Nachislenie with id: ${id}`)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
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
