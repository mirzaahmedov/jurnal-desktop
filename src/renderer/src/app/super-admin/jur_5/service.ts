import type { AdminZarplataDocument } from './interfaces'
import type { AdminZarplataDashboard, ApiResponse, MainZarplata } from '@/common/models'
import type { Vacant } from '@/common/models/vacant'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApiNew } from '@/common/lib/zarplata'

interface AdminZarplataDashboardMeta {
  totalRegion: number
  totalUderjanie: number
}

export class AdminZarplataDashboardService {
  static QueryKeys = {
    GetAll: 'get-zarplata-dashboard',
    GetByMainSchetId: 'get-zarplata-dashboard-by-mainSchetId',
    GetVacant: 'get-zarplata-dashboard-vacant',
    GetMainZarplata: 'get-zarplata-dashboard-mainZarplata'
  } as const

  static async getAll(
    ctx: QueryFunctionContext<
      [
        typeof AdminZarplataDashboardService.QueryKeys.GetAll,
        { from: string; to: string; search?: string }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get<
      ApiResponse<AdminZarplataDashboard[], AdminZarplataDashboardMeta>
    >(`/ExportZarplata/get-dashboard`, {
      params
    })
    return res.data
  }

  static async getByMainSchetId(
    ctx: QueryFunctionContext<
      [typeof AdminZarplataDashboardService.QueryKeys.GetByMainSchetId, { mainSchetId: number }]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get<AdminZarplataDocument[]>(
      `/ExportZarplata/get-dashboard-by-mainSchetId`,
      {
        params
      }
    )
    return res.data
  }

  static async getVacant(
    ctx: QueryFunctionContext<
      [
        typeof AdminZarplataDashboardService.QueryKeys.GetVacant,
        {
          budjetId: number
          regionId: number
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get<Vacant[]>(`/ExportZarplata/get-dashboard-vacant`, {
      params: {
        regionId: params.regionId,
        spId: params.budjetId
      }
    })
    return res.data
  }

  static async getMainZarplata(
    ctx: QueryFunctionContext<
      [
        typeof AdminZarplataDashboardService.QueryKeys.GetMainZarplata,
        {
          regionId: number
          vacantId: number
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get<MainZarplata[]>(
      `/ExportZarplata/get-dashboard-mainZarplata`,
      {
        params: {
          regionId: params.regionId,
          vacantId: params.vacantId
        }
      }
    )
    return res.data
  }
}
