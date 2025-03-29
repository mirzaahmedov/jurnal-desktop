import type { Nachislenie, Response, Uderjanie, UderjanieAliment } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@renderer/common/features/crud'
import { http } from '@renderer/common/lib/http'

import { zarplataApi } from '@/common/lib/zarplata'

export class NachislenieService {
  static async getAll(ctx: QueryFunctionContext<[string, { userId: number; vacantId: number }]>) {
    const { userId, vacantId } = ctx.queryKey[1]
    const res = await zarplataApi.get<Nachislenie[]>('Nachislenie', {
      params: {
        PageIndex: 1,
        PageSize: 10000000,
        userId,
        vacantId
      }
    })
    return res.data
  }
}

export class UderjanieService {
  static async getAll(
    ctx: QueryFunctionContext<[string, { userId: number; tabelDocNum: number }]>
  ) {
    const { userId, tabelDocNum } = ctx.queryKey[1]
    const res = await zarplataApi.get<Uderjanie[]>(`Uderjanie/nachislenie/${userId}`, {
      params: {
        PageIndex: 1,
        PageSize: 10000000,
        tabelDocNum
      }
    })
    return res.data
  }
  static async getAliment(
    ctx: QueryFunctionContext<[string, { userId: number; tabelDocNum: number }]>
  ) {
    const { userId, tabelDocNum } = ctx.queryKey[1]
    const res = await zarplataApi.get<UderjanieAliment[]>(
      `Uderjanie/nachislenie-aliment/${userId}`,
      {
        params: {
          tabelDocNum
        }
      }
    )
    return res.data
  }
}

export class BankRasxodImportService {
  static async importZarplata(args: { data: UderjanieAliment[]; main_schet_id: number }) {
    const { data, main_schet_id } = args
    const res = await http.post<Response<unknown>>(
      `${ApiEndpoints.bank_rasxod}/import`,
      { docs: data },
      {
        params: {
          main_schet_id
        }
      }
    )
    return res.data
  }
}
