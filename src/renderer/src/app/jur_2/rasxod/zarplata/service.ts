import type {
  ApiResponse,
  Nachislenie,
  Uderjanie,
  UderjanieAliment,
  UderjaniePlastik
} from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@/common/features/crud'
import { http } from '@/common/lib/http'
import { zarplataApi } from '@/common/lib/zarplata'

export class NachislenieService {
  static async getElementsByRayon(
    ctx: QueryFunctionContext<[string, { userId: number; rayon: string }]>
  ) {
    const { userId, rayon } = ctx.queryKey[1]
    const res = await zarplataApi.get<Nachislenie[]>('Nachislenie/get-items-with-rayon', {
      params: {
        PageIndex: 1,
        PageSize: 10000000,
        userId,
        rayon
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
  static async getPlastik(
    ctx: QueryFunctionContext<[string, { userId: number; tabelDocNum: number }]>
  ) {
    const { userId, tabelDocNum } = ctx.queryKey[1]
    const res = await zarplataApi.get<UderjaniePlastik>(`Uderjanie/nachislenie-plastik/${userId}`, {
      params: {
        tabelDocNum
      }
    })
    return res.data
  }
}

export class BankRasxodImportService {
  static async importZarplata(args: { data: UderjanieAliment[]; main_schet_id: number }) {
    const { data, main_schet_id } = args
    const res = await http.post<ApiResponse<unknown>>(
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
