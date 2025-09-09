import type { SpravochnikHookOptions } from '../spravochnik'
import type { MainZarplataFormValues } from '@/app/jur_5/passport-details/config'
import type {
  ApiResponse,
  MainZarplata,
  MainZarplataCalculation,
  MainZarplataMatPomoch,
  MainZarplataNachislenie
} from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { t } from 'i18next'

import { ApiEndpoints } from '@/common/features/crud'
import { capitalize } from '@/common/lib/string'
import { extendObject } from '@/common/lib/utils'
import { getMultiApiResponse, getSingleApiResponse } from '@/common/lib/zarplata'
import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

import { MainZarplataColumns } from './columns'

export class MainZarplataService {
  static endpoint = ApiEndpoints.main_zarplata

  static QueryKeys = {
    GetAll: 'main_zarplata/getAll',
    GetByVacantId: 'main_zarplata/getByVacantId',
    GetMatPomoch: 'main_zarplata/getMatPomoch',
    GetNachislenies: 'main_zarplata/getNachislenies',
    GetById: 'main_zarplata/getById'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        string,
        {
          page: number
          limit: number
          search: string
        }
      ]
    >
  ): Promise<ApiResponse<MainZarplata[]>> {
    const { page, limit, search } = ctx.queryKey[1]
    const res = await zarplataApiNew.get<{
      totalCount: number
      data: MainZarplata[]
    }>(MainZarplataService.endpoint, {
      params: {
        PageIndex: page,
        PageSize: limit || 10,
        search
      }
    })
    return getMultiApiResponse({
      response: res.data,
      page,
      limit
    })
  }

  static async getByVacantId(
    ctx: QueryFunctionContext<
      [
        typeof MainZarplataService.QueryKeys.GetByVacantId,
        {
          vacantId: number
          ostanovit?: boolean
          year?: number
          month?: number
        }
      ]
    >
  ) {
    const { vacantId, ostanovit, year, month } = ctx.queryKey[1]
    const res = await zarplataApiNew.get<MainZarplata[]>(
      `${MainZarplataService.endpoint}/get-by-vacantId`,
      {
        params: {
          vacantId,
          ostanovit,
          year,
          month
        }
      }
    )
    return res.data
  }

  static async getById(
    ctx: QueryFunctionContext<[string, number]>
  ): Promise<ApiResponse<MainZarplata>> {
    const id = ctx.queryKey[1]
    const res = await zarplataApiNew.get<MainZarplata>(`${MainZarplataService.endpoint}/${id}`)
    return getSingleApiResponse({
      response: res.data
    })
  }

  static async getPositionSalary(id: number) {
    const res = await zarplataApiNew.put<ZarplataApiResponse<MainZarplataCalculation[]>>(
      `${MainZarplataService.endpoint}/position-salary/${id}`
    )
    return res.data
  }

  static async calculateSalaryById(
    values: Array<{
      mainZarplataId: number
    }>
  ) {
    const res = await zarplataApiNew.put<ZarplataApiResponse<MainZarplataCalculation[]>>(
      `${MainZarplataService.endpoint}/calculate-by-ids`,
      values
    )
    return res.data
  }

  static async calculateSalaryAll() {
    const res = await zarplataApiNew.put<ZarplataApiResponse<MainZarplataCalculation[]>>(
      `${MainZarplataService.endpoint}/calculate-all`
    )
    return res.data
  }

  static async create(values: MainZarplataFormValues): Promise<ApiResponse<MainZarplata>> {
    const res = await zarplataApiNew.post<MainZarplata>(MainZarplataService.endpoint, values)
    return getSingleApiResponse({
      response: res.data
    })
  }

  static async update({
    id,
    values
  }: {
    id: number
    values: MainZarplataFormValues
  }): Promise<MainZarplata> {
    const res = await zarplataApiNew.put<MainZarplata>(
      `${MainZarplataService.endpoint}/${id}`,
      values
    )
    return res.data
  }

  static async delete(id: number): Promise<void> {
    await zarplataApiNew.delete(`${MainZarplataService.endpoint}/${id}`)
  }

  static async dismissEmployee(args: { mainId: number; prikazFinish: string; dateFinish: string }) {
    const res = await zarplataApiNew.put<MainZarplata>(
      `${MainZarplataService.endpoint}/dismiss/${args.mainId}`,
      {},
      {
        params: {
          prikazFinish: args.prikazFinish,
          dateFinish: args.dateFinish
        }
      }
    )
    return res.data
  }

  static async getMatPomoch(
    ctx: QueryFunctionContext<[typeof MainZarplataService.QueryKeys.GetMatPomoch, number]>
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const res = await zarplataApiNew.get<MainZarplataMatPomoch[]>(
      `${MainZarplataService.endpoint}/get-matPomoch`,
      {
        params: {
          mainZarplataId
        }
      }
    )
    return res.data
  }

  static async getNachislenies(
    ctx: QueryFunctionContext<
      [typeof MainZarplataService.QueryKeys.GetMatPomoch, number, { year?: number; month?: number }]
    >
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const { year, month } = ctx.queryKey[2]
    const res = await zarplataApiNew.get<MainZarplataNachislenie[]>(
      `${MainZarplataService.endpoint}/get-nachislenies`,
      {
        params: {
          mainZarplataId,
          year,
          month
        }
      }
    )
    return res.data
  }
}

export const createMainZarplataSpravochnik = (
  config: Partial<SpravochnikHookOptions<MainZarplata>>
) => {
  return extendObject(
    {
      title: capitalize(t('choose', { what: t('podotchet-litso') })),
      columnDefs: MainZarplataColumns,
      endpoint: ApiEndpoints.main_zarplata,
      service: MainZarplataService,
      filters: []
    } satisfies typeof config,
    config
  )
}
